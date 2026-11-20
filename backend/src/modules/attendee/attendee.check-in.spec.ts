import { OrderStatus } from '@prisma/client';
import { AttendeeService } from './attendee.service';
import { toEventDayKey } from 'src/common/utils/event-date';
import { buildSignedTicketDownloadUrl } from 'src/common/utils/ticket-download-url';

const SECRET = 'test-secret';

type Row = {
  id: string;
  status: OrderStatus;
  reference: string;
  ticket_id: string;
  check_ins: Date[] | null;
  attendee_full_name: string;
  attendee_email: string;
};

const row = (o: Partial<Row> = {}): Row => ({
  id: 'order-1',
  status: OrderStatus.PAID,
  reference: 'DFI-ABC123',
  ticket_id: 'ticket-1',
  check_ins: [],
  attendee_full_name: 'Ada Lovelace',
  attendee_email: 'ada@example.com',
  ...o,
});

function build(order: Row | undefined, validityDates: string[]) {
  const update = jest.fn(({ data }) =>
    Promise.resolve({
      checkIns: [...(order?.check_ins ?? []), data.checkIns.push],
    }),
  );
  const auditCreate = jest.fn().mockResolvedValue({});
  const tx = {
    auditLog: { create: auditCreate },
    $queryRaw: jest.fn().mockResolvedValue(order ? [order] : []),
    ticket: {
      findUnique: jest.fn().mockResolvedValue({
        name: 'Regular',
        validityDates: validityDates.map((d) => new Date(d)),
      }),
    },
    order: { update },
  };
  const findFirst = jest.fn();
  const findMany = jest.fn();
  const prisma = {
    $transaction: (fn: (t: typeof tx) => unknown) => fn(tx),
    order: { findFirst, findMany },
  };
  const svc = new AttendeeService(
    prisma as never,
    {
      ticketJWTSecret: SECRET,
    } as never,
  );
  return { svc, update, auditCreate, findFirst, findMany };
}

describe('AttendeeService.checkIn', () => {
  // 2026-11-21 08:30 in Lagos (UTC+1)
  const eventMorning = new Date('2026-11-21T07:30:00.000Z');

  beforeEach(() => jest.useFakeTimers().setSystemTime(eventMorning));
  afterEach(() => jest.useRealTimers());

  it('checks in a paid attendee on a valid day', async () => {
    const { svc, update } = build(row(), ['2026-11-21']);
    const res = await svc.checkIn({ orderId: ' order-1 ' });
    expect(res.alreadyCheckedIn).toBe(false);
    expect(res.code).toBe('ABC123');
    expect(res.attendeeFullName).toBe('Ada Lovelace');
    expect(update).toHaveBeenCalledTimes(1);
  });

  it('flags a second scan the same day without adding another entry', async () => {
    const earlier = new Date('2026-11-21T07:05:00.000Z');
    const { svc, update } = build(row({ check_ins: [earlier] }), [
      '2026-11-21',
    ]);
    const res = await svc.checkIn({ orderId: 'order-1' });
    expect(res.alreadyCheckedIn).toBe(true);
    expect(res.checkedInAt).toEqual(earlier);
    expect(update).not.toHaveBeenCalled();
  });

  it('allows a new check-in on day 2 of a multi-day ticket', async () => {
    jest.setSystemTime(new Date('2026-11-22T08:00:00.000Z'));
    const { svc, update } = build(
      row({ check_ins: [new Date('2026-11-21T08:00:00.000Z')] }),
      ['2026-11-21', '2026-11-22'],
    );
    const res = await svc.checkIn({ orderId: 'order-1' });
    expect(res.alreadyCheckedIn).toBe(false);
    expect(update).toHaveBeenCalledTimes(1);
  });

  it('rejects a ticket not valid today', async () => {
    const { svc } = build(row(), ['2026-11-22']);
    await expect(svc.checkIn({ orderId: 'order-1' })).rejects.toMatchObject({
      name: AttendeeService.ERRORS.UnmatchedValidityDateErr,
    });
  });

  it('rejects unpaid orders', async () => {
    const { svc } = build(row({ status: OrderStatus.AWAITING_PAYMENT }), [
      '2026-11-21',
    ]);
    await expect(svc.checkIn({ orderId: 'order-1' })).rejects.toMatchObject({
      name: AttendeeService.ERRORS.CheckInUnpaidOrderErr,
    });
  });

  it('returns not found for unknown orders', async () => {
    const { svc } = build(undefined, ['2026-11-21']);
    await expect(svc.checkIn({ orderId: 'nope' })).rejects.toMatchObject({
      name: AttendeeService.ERRORS.TicketNotFoundErr,
    });
  });

  it('uses the venue day, not UTC, just after midnight in Lagos', async () => {
    // 00:30 Lagos on the 21st is still the 20th in UTC.
    jest.setSystemTime(new Date('2026-11-20T23:30:00.000Z'));
    expect(toEventDayKey(new Date())).toBe('2026-11-21');
    const { svc } = build(row(), ['2026-11-21']);
    await expect(svc.checkIn({ orderId: 'order-1' })).resolves.toMatchObject({
      alreadyCheckedIn: false,
    });
  });

  it('writes an audit entry with the staff member on check-in', async () => {
    const { svc, auditCreate } = build(row(), ['2026-11-21']);
    await svc.checkIn({ orderId: 'order-1' }, 'admin-7');
    expect(auditCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          adminId: 'admin-7',
          action: AttendeeService.AUDIT.CheckIn,
        }),
      }),
    );
  });

  it('logs a duplicate scan separately', async () => {
    const { svc, auditCreate } = build(
      row({ check_ins: [new Date('2026-11-21T07:00:00.000Z')] }),
      ['2026-11-21'],
    );
    await svc.checkIn({ orderId: 'order-1' }, 'admin-7');
    expect(auditCreate.mock.calls[0][0].data.action).toBe(
      AttendeeService.AUDIT.DuplicateCheckIn,
    );
  });
});

describe('AttendeeService.scanCheckIn', () => {
  beforeEach(() =>
    jest.useFakeTimers().setSystemTime(new Date('2026-11-21T08:00:00Z')),
  );
  afterEach(() => jest.useRealTimers());

  it('accepts the signed QR download URL printed on the ticket', async () => {
    const { svc, findFirst, update } = build(row(), ['2026-11-21']);
    findFirst.mockResolvedValue({ id: 'order-1' });
    const url = buildSignedTicketDownloadUrl(
      'DFI-ABC123',
      SECRET,
      'https://api.example.com',
    );
    const res = await svc.scanCheckIn(url, 'admin-1');
    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { reference: 'DFI-ABC123' } }),
    );
    expect(res.alreadyCheckedIn).toBe(false);
    expect(update).toHaveBeenCalled();
  });

  it('rejects a QR signed with another secret', async () => {
    const { svc } = build(row(), ['2026-11-21']);
    const url = buildSignedTicketDownloadUrl(
      'DFI-ABC123',
      'wrong',
      'https://api.example.com',
    );
    await expect(svc.scanCheckIn(url)).rejects.toMatchObject({
      name: AttendeeService.ERRORS.InvalidTicketQrErr,
    });
  });

  it('resolves a typed 6-character code, preferring the paid order', async () => {
    const { svc, findMany } = build(row(), ['2026-11-21']);
    findMany.mockResolvedValue([
      { id: 'old', status: OrderStatus.CANCELLED },
      { id: 'order-1', status: OrderStatus.PAID },
    ]);
    const res = await svc.scanCheckIn('abc123');
    expect(res.orderId).toBe('order-1');
  });

  it('refuses an ambiguous code', async () => {
    const { svc, findMany } = build(row(), ['2026-11-21']);
    findMany.mockResolvedValue([
      { id: 'a', status: OrderStatus.PAID },
      { id: 'b', status: OrderStatus.PAID },
    ]);
    await expect(svc.scanCheckIn('ABC123')).rejects.toMatchObject({
      name: AttendeeService.ERRORS.AmbiguousTicketCodeErr,
    });
  });
});

describe('AttendeeService.undoCheckIn', () => {
  beforeEach(() =>
    jest.useFakeTimers().setSystemTime(new Date('2026-11-22T10:00:00Z')),
  );
  afterEach(() => jest.useRealTimers());

  it("removes only today's check-in and audits it", async () => {
    const day1 = new Date('2026-11-21T08:00:00Z');
    const day2 = new Date('2026-11-22T08:00:00Z');
    const { svc, update, auditCreate } = build(
      row({ check_ins: [day1, day2] }),
      ['2026-11-21', '2026-11-22'],
    );
    const res = await svc.undoCheckIn({ orderId: 'order-1' }, 'admin-1');
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { checkIns: { set: [day1] } } }),
    );
    expect(res.checkIns).toEqual([day1]);
    expect(auditCreate.mock.calls[0][0].data.action).toBe(
      AttendeeService.AUDIT.UndoCheckIn,
    );
  });

  it('errors when not checked in today', async () => {
    const { svc } = build(
      row({ check_ins: [new Date('2026-11-21T08:00:00Z')] }),
      ['2026-11-21', '2026-11-22'],
    );
    await expect(
      svc.undoCheckIn({ orderId: 'order-1' }, 'admin-1'),
    ).rejects.toMatchObject({
      name: AttendeeService.ERRORS.NotCheckedInTodayErr,
    });
  });
});

// Run: node --test tests/concierge-pick.test.mts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  closestMatches,
  planFor,
  pickSessions,
  timeRange,
  type ConciergeSession,
} from '../app/schedule/pick.ts';

const s = (
  id: string,
  time: string,
  type: ConciergeSession['type'] = 'session'
) => ({
  id,
  title: id,
  type,
  hall: 'Hall',
  time,
});
const fit = (score: number, good: number, must = 0, near = good) => ({
  score,
  near,
  good,
  must,
});

const sessions: ConciergeSession[] = [
  s('flutter', '2:15 PM - 2:40 PM'),
  s('pytorch', '2:00 PM - 2:45 PM', 'workshop'),
  s('privacy', '3:00 PM - 3:25 PM'),
  s('keynote', '9:45 AM - 10:05 AM'),
  s('weak', '4:15 PM - 4:25 PM', 'lightning'),
  s('lounge1', '1:30 PM - 2:30 PM', 'vibe'),
  s('lounge2', '3:40 PM - 4:40 PM', 'vibe'),
  s('late', '3:45 PM - 4:10 PM'),
];

test('parses 12-hour ranges, including noon', () => {
  assert.deepEqual(timeRange('11:55 AM - 12:20 PM'), { start: 715, end: 740 });
});

test('drops weak fits, resolves clashes by best fit, sorts by time', () => {
  const picks = pickSessions(sessions, {
    flutter: fit(2.9, 0.99, 0.95),
    pytorch: fit(2.0, 0.7),
    privacy: fit(1.7, 0.6),
    keynote: fit(1.9, 0.55),
    weak: fit(1.6, 0.4), // middling score but under half the mass on "good fit"
  });
  assert.deepEqual(
    picks.map((p) => p.session.id),
    ['keynote', 'flutter', 'privacy']
  );
  assert.equal(picks[1].fit, 'must');
  assert.equal(picks[0].fit, 'good');
  assert.deepEqual(
    picks[1].alsoRunning.map((x) => x.id),
    ['pytorch']
  );
});

test('type filter applies before clash resolution', () => {
  const picks = pickSessions(
    sessions,
    { flutter: fit(2.9, 1), pytorch: fit(2, 0.7) },
    ['workshop']
  );
  assert.deepEqual(
    picks.map((p) => p.session.id),
    ['pytorch']
  );
  assert.equal(picks[0].alsoRunning.length, 0);
});

test('only one Vibe Lounge slot, placed where it does not clash', () => {
  const picks = pickSessions(sessions, {
    flutter: fit(2.9, 1),
    lounge1: fit(2.5, 1),
    lounge2: fit(2.5, 1),
  });
  assert.deepEqual(
    picks.map((p) => p.session.id),
    ['flutter', 'lounge2']
  );
});

test('lounge beats a good-fit talk in a clash but not a must-attend', () => {
  const picks = pickSessions(sessions, {
    flutter: fit(2.9, 1, 0.9),
    lounge1: fit(2.5, 1),
    late: fit(2.0, 0.8),
    lounge2: fit(2.5, 1),
  });
  // lounge1 loses to flutter (must-attend); lounge2 beats the good-fit "late" talk.
  assert.deepEqual(
    picks.map((p) => p.session.id),
    ['flutter', 'lounge2']
  );
  assert.deepEqual(
    picks[1].alsoRunning.map((x) => x.id),
    ['late']
  );
});

test('closest matches: top three adjacent sessions, never the lounge', () => {
  const near = (score: number, n: number) => fit(score, 0.1, 0, n);
  const picks = closestMatches(sessions, {
    keynote: near(1.2, 0.95),
    privacy: near(1.1, 0.9),
    weak: near(1.0, 0.8),
    flutter: near(0.9, 0.75),
    pytorch: near(0.3, 0.2),
    lounge1: fit(2.5, 1),
  });
  assert.deepEqual(
    picks.map((p) => p.session.id),
    ['keynote', 'privacy', 'weak']
  );
  assert.ok(picks.every((p) => p.fit === 'good'));
});

test('calendar times convert Lagos time to UTC', async () => {
  const { eventTimes, googleCalendarUrl, buildIcs } =
    await import('../app/schedule/pick.ts');
  const talk = {
    ...s('x', '1:30 PM - 1:55 PM'),
    title: 'Distributed Systems, with gRPC; part 1',
    hall: 'Hall 2',
  };
  assert.deepEqual(eventTimes(talk), {
    start: '20261121T123000Z',
    end: '20261121T125500Z',
  });
  assert.match(
    googleCalendarUrl(talk),
    /dates=20261121T123000Z%2F20261121T125500Z/
  );

  const ics = buildIcs(
    [talk, { ...talk, id: 'y' }],
    new Date('2026-11-01T00:00:00Z')
  );
  assert.equal(ics.match(/BEGIN:VEVENT/g)?.length, 2);
  assert.ok(
    ics.includes('SUMMARY:Distributed Systems\\, with gRPC\\; part 1'),
    'commas and semicolons escaped'
  );
  assert.ok(
    ics.split('\r\n').every((l) => new TextEncoder().encode(l).length <= 75),
    'lines folded to 75 octets'
  );
  const long = buildIcs([{ ...talk, title: '’'.repeat(60) }]);
  assert.ok(
    long.split('\r\n').every((l) => new TextEncoder().encode(l).length <= 75)
  );
  assert.ok(
    long.replace(/\r\n /g, '').includes('’'.repeat(60)),
    'unfolds back intact'
  );
});

test('filter hiding real fits returns no picks, not closest matches', () => {
  const fits = { flutter: fit(2.9, 1, 0.9), pytorch: fit(1.0, 0.1, 0, 0.9) };
  assert.deepEqual(planFor(sessions, fits, ['workshop']), {
    nearby: false,
    picks: [],
  });
  const none = planFor(sessions, { pytorch: fit(1.0, 0.1, 0, 0.9) }, []);
  assert.equal(none.nearby, true);
  assert.deepEqual(
    none.picks.map((p) => p.session.id),
    ['pytorch']
  );
});

test('lounge is listed once under a clashing pick', () => {
  const twoLounges = [...sessions, s('lounge3', '2:00 PM - 2:20 PM', 'vibe')];
  const picks = pickSessions(twoLounges, {
    pytorch: fit(2.9, 1, 0.9),
    lounge1: fit(2.5, 1),
    lounge3: fit(2.5, 1),
  });
  assert.deepEqual(
    picks.map((p) => p.session.id),
    ['pytorch']
  );
  assert.deepEqual(
    picks[0].alsoRunning.map((x) => x.id),
    ['lounge1']
  );
});

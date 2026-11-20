import { BadRequestException } from '@nestjs/common';
import { EmailAssetKind } from '@prisma/client';
import { sanitizeFilename, validateEmailAsset } from './email-asset.util';

const file = (name: string, mimetype: string, bytes: number[] | string) => {
  const buffer = Buffer.from(bytes as never);
  return { originalname: name, mimetype, size: buffer.length, buffer };
};
const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a];
const PDF = '%PDF-1.7 body';

describe('validateEmailAsset', () => {
  it('accepts a real PDF and PNG', () => {
    expect(
      validateEmailAsset(
        file('a.pdf', 'application/pdf', PDF),
        EmailAssetKind.ATTACHMENT,
      ),
    ).toMatchObject({ mimeType: 'application/pdf', isImage: false });
    expect(
      validateEmailAsset(
        file('p.PNG', 'image/png', PNG),
        EmailAssetKind.INLINE_IMAGE,
      ),
    ).toMatchObject({ mimeType: 'image/png', isImage: true });
  });

  it('rejects executables and archives by extension', () => {
    for (const name of ['x.exe', 'x.zip', 'x.js', 'x.html', 'x.svg', 'noext']) {
      expect(() =>
        validateEmailAsset(
          file(name, 'application/octet-stream', 'MZ'),
          EmailAssetKind.ATTACHMENT,
        ),
      ).toThrow(BadRequestException);
    }
  });

  it('rejects a renamed file whose bytes do not match', () => {
    expect(() =>
      validateEmailAsset(
        file('evil.pdf', 'application/pdf', 'MZ\u0090\u0000'),
        EmailAssetKind.ATTACHMENT,
      ),
    ).toThrow(/does not match/);
    expect(() =>
      validateEmailAsset(
        file('evil.png', 'image/png', PDF),
        EmailAssetKind.INLINE_IMAGE,
      ),
    ).toThrow(/does not match/);
  });

  it('rejects a mime type that disagrees with the extension', () => {
    expect(() =>
      validateEmailAsset(
        file('a.pdf', 'image/png', PDF),
        EmailAssetKind.ATTACHMENT,
      ),
    ).toThrow(/does not match/);
  });

  it('allows only images in the body, and only text-like csv/txt', () => {
    expect(() =>
      validateEmailAsset(
        file('a.pdf', 'application/pdf', PDF),
        EmailAssetKind.INLINE_IMAGE,
      ),
    ).toThrow(/Only images/);
    expect(() =>
      validateEmailAsset(
        file('a.csv', 'text/csv', [0x61, 0x00, 0x62]),
        EmailAssetKind.ATTACHMENT,
      ),
    ).toThrow(/does not match/);
    expect(
      validateEmailAsset(
        file('a.csv', 'text/csv', 'a,b\n1,2'),
        EmailAssetKind.ATTACHMENT,
      ),
    ).toMatchObject({ mimeType: 'text/csv' });
  });

  it('rejects files over 4 MB and empty files', () => {
    const big = Buffer.alloc(4 * 1024 * 1024 + 1, 0x25);
    expect(() =>
      validateEmailAsset(
        {
          originalname: 'a.txt',
          mimetype: 'text/plain',
          size: big.length,
          buffer: big,
        },
        EmailAssetKind.ATTACHMENT,
      ),
    ).toThrow(/4 MB/);
    expect(() =>
      validateEmailAsset(
        file('a.txt', 'text/plain', ''),
        EmailAssetKind.ATTACHMENT,
      ),
    ).toThrow(/empty/);
  });
});

describe('sanitizeFilename', () => {
  it('drops paths and unsafe characters', () => {
    expect(sanitizeFilename('../../etc/pass wd.pdf')).toBe('pass wd.pdf');
    expect(sanitizeFilename('a"b\r\nc.pdf')).toBe('a_b_c.pdf');
    expect(sanitizeFilename('...')).toBe('file');
  });
});

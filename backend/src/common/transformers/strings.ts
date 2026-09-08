import { randomInt } from 'node:crypto';

const DEFAULT_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function randomString(
  length: number,
  alphabet = DEFAULT_ALPHABET,
): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += alphabet[randomInt(alphabet.length)];
  }
  return result;
}

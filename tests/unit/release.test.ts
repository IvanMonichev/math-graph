import { describe, expect, it } from 'vitest';
import { nextVersion } from '../../scripts/release.mjs';

describe('release version', () => {
  it.each([
    ['patch', '1.2.4'],
    ['minor', '1.3.0'],
    ['major', '2.0.0'],
    ['3.0.1', '3.0.1'],
  ])('supports %s', (bump, expected) => {
    expect(nextVersion('1.2.3', bump)).toBe(expected);
  });
  it.each(['1.2.3', '1.2.2', '0.9.9', '01.3.0', '1.3', 'v2.0.0', 'beta', '1.3.0; echo nope'])(
    'rejects invalid or non-increasing version %s',
    (bump) => {
      expect(() => nextVersion('1.2.3', bump)).toThrow();
    },
  );
});

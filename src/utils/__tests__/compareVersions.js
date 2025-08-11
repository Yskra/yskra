import { expect, it } from 'vitest';
import compareVersions from '../compareVersions';

it('should return true when version1 is greater than version2', () => {
  const result = compareVersions('2.0.0', '1.0.0');

  expect(result).to.be.true;
});

it('should return false when version1 is less than version2', () => {
  const result = compareVersions('1.0.0', '2.0.0');

  expect(result).to.be.false;
});

it('should return true when version1 is equal to version2', () => {
  const result = compareVersions('1.0.0', '1.0.0');

  expect(result).to.be.true;
});

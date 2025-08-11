/* oxlint-disable no-unused-expressions */

import { expect, it } from 'vitest';
import validUrl from '../validUrl';

it('should return true for a valid URL with http protocol', () => {
  // noinspection HttpUrlsUsage
  expect(validUrl('http://www.example.com')).to.be.true;
});

it('should return true for a valid URL with https protocol', () => {
  expect(validUrl('https://www.example.com')).to.be.true;
});

it('should return false for an invalid URL', () => {
  expect(validUrl('invalid-url')).to.be.false;
});

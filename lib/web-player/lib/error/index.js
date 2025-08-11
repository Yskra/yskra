import { ErrorType } from './constants.js';
import LibraryError from './LibraryError.js';

export default LibraryError;
export { ErrorType };

/**
 * @param {string} msg
 * @param {object} data
 */
export function createPlayerError(msg, data = {}) {
  return new LibraryError(msg, ErrorType.PLAYER, data);
}

/**
 * @param {string} msg
 * @param {object} data
 */
export function createUnsupportedError(msg, data = {}) {
  return new LibraryError(msg, ErrorType.UNSUPPORTED, data);
}

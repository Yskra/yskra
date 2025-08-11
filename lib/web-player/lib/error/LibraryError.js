import { ErrorType, ErrorType2Code } from './constants';


export default class LibraryError extends Error {
  name = 'WebPlayerError';

  /**
   * @param {string} message - Сообщение об ошибке
   * @param {number} type - Тип ошибки
   * @param data
   */
  constructor(message, type = ErrorType.UNKNOWN, data = {}) {
    super(message);
    this.type = type;
    this.details = data;
    this.code = ErrorType2Code[type];
    Error.captureStackTrace?.(this, this.constructor);
  }

  /**
   * @param {number} type
   * @return {boolean}
   */
  is(type) {
    return (this.type & type) !== 0;
  }

  /**
   * @param {number} type
   * @return {boolean}
   */
  hasAll(type) {
    return (this.type & type) === type;
  }
}

/** @import {EntryLevel} from '@/modules/logger/Public'; */

import { COLOR, contextStyle, prefixStyle } from './constants';
import useStoreMessage from './utils/useStoreMessage.js';

export class Logger {
  _prefix = { text: '', color: '' };
  /** @type {string} */
  _context;
  /** @type {(level: EntryLevel, ...message: any) => void} */
  _store;

  /**
   * @param {string} context context
   * @param {typeof this._prefix} prefix prefix
   */
  constructor(context, prefix = { text: 'App', color: '#00A96D' }) {
    this._prefix = prefix;
    this._context = context;
    this._store = useStoreMessage(prefix.text, prefix.color, context);
  }

  /**
   * @param {string} contextColor context color
   */
  _getBadge(contextColor) {
    return [
      `%c${this._prefix.text}:%c${this._context}`,
      `background: ${this._prefix.color}; ${prefixStyle}`,
      `background: ${contextColor}; ${contextStyle}`,
    ];
  }

  /**
   * @param {...any} message message
   */
  info(...message) {
    this._store('info', ...message);
    // oxlint-disable-next-line no-console
    console.info(...this._getBadge(COLOR.INFO), ...message);
  }

  /**
   * @param {...any} message message
   */
  warn(...message) {
    this._store('warn', ...message);
    console.warn(...this._getBadge(COLOR.WARN), ...message);
  }

  /**
   * @param {...any} message message
   */
  error(...message) {
    this._store('error', ...message);
    console.error(...this._getBadge(COLOR.ERROR), ...message);
  }
}

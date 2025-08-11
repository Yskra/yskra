/** @import {LoggerLevel} from '@/modules/logger/Public'; */

import { initLogger } from '@/modules/logger/stores/logs.js';

const baseStyle = 'color: #383A58; font-size: 10px; padding: 4px; font-weight: 700;';
const prefixStyle = `${baseStyle}`;
const contextStyle = `${baseStyle}`;

const COLOR = Object.freeze({
  INFO: '#00B4FF',
  WARN: '#FFBD00',
  ERROR: '#FF5760',
});

export class Logger {
  _prefix = { text: '', color: '' };
  /** @type {string} */
  _context;
  /** @type {(level: LoggerLevel, ...message: any) => void} */
  _save;

  /**
   * @param {string} context context
   * @param {typeof this._prefix} prefix prefix
   */
  constructor(context, prefix = { text: 'App', color: '#00A96D' }) {
    this._prefix = prefix;
    this._context = context;
    this._save = initLogger(prefix.text, prefix.color, context);
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
    this._save('info', ...message);
    // oxlint-disable-next-line no-console
    console.info(...this._getBadge(COLOR.INFO), ...message);
  }

  /**
   * @param {...any} message message
   */
  warn(...message) {
    this._save('warn', ...message);
    console.warn(...this._getBadge(COLOR.WARN), ...message);
  }

  /**
   * @param {...any} message message
   */
  error(...message) {
    this._save('error', ...message);
    console.error(...this._getBadge(COLOR.ERROR), ...message);
  }
}

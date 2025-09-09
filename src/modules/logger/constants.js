/** @import {EntryLevel} from '@/modules/logger/Public'; */

export const FILTER_LEVELS_ALLOWED = Object.freeze({
  info: ['info', 'warn', 'error'],
  warn: ['warn', 'error'],
  error: ['error'],
});

export const MAX_ENTRIES = 100;

export const EVENT_LOG_MESSAGE = 'logger:message';

export const baseStyle = 'color: #383A58; font-size: 10px; padding: 4px; font-weight: 700;';
export const prefixStyle = `${baseStyle}`;
export const contextStyle = `${baseStyle}`;
export const COLOR = Object.freeze({
  INFO: '#00B4FF',
  WARN: '#FFBD00',
  ERROR: '#FF5760',
});

export const MESSAGES_GROUP_ID = Symbol('messages id');
export const ENTRIES_GROUP_ID = Symbol('group entries id');

/** @type {Readonly<EntryLevel[]>} */
export const ALLOWED_LEVELS = Object.freeze(['info', 'warn', 'error']);

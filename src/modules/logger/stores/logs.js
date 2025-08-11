/** @import {StoreEntries, LoggerLevel} from '@/modules/logger/Public'; */

import { computed, markRaw, reactive, ref } from 'vue';
import logMessage2str from '@/modules/logger/utils/logMessange2str.js';
import saveTextAsFile from '@/utils/saveTextAsFile.js';

const FILTER_LEVELS_ALLOWED = Object.freeze({
  info: ['info', 'warn', 'error'],
  warn: ['warn', 'error'],
  error: ['error'],
});
const MAX_ENTRIES = 100;

/** @type {StoreEntries} */
const entries = reactive({});

/** @type {import('vue').Ref<LoggerLevel>} */
export const filterLevel = ref('info');

const notEmptyEntries = computed(() => Object.fromEntries(
  Object.entries(entries).filter(([, { messages }]) => messages.length > 0),
));

export const filteredEntries = computed(() => Object.fromEntries(
  Object.entries(notEmptyEntries.value)
    .map(([key, { messages, ...rest }]) => [
      key,
      { ...rest, messages: messages.filter(({ level }) => FILTER_LEVELS_ALLOWED[filterLevel.value].includes(level)) },
    ]),
));

// return {
//   entries,
//   notEmptyEntries,
//   filterLevel,
//   filteredEntries,
//   initLogger,
//   saveLogs,
// };

/**
 * @param {string} prefix
 * @param {string} color
 * @param {string} context
 */
export function initLogger(prefix, color, context) {
  const id = `${prefix}-${context}`;

  if (!entries[id]) {
    entries[id] = {
      meta: markRaw({
        prefix,
        context,
        color,
      }),
      getters: {
        hasErrors: computed(() => entries[id].messages.some(({ level }) => level === 'error')),
      },
      messages: [],
    };
  }

  /**
   * @param {LoggerLevel} level
   * @param {...any} message
   */
  return function (level, ...message) {
    if (message.every((/** @type {any} */ m) => !m)) {
      return;
    }
    const date = new Date();

    if (entries[id].messages.length > MAX_ENTRIES) { // recursive render error ?
      return;
    }

    entries[id].messages.push({ level, message, date });
  };
}

export function saveLogs() {
  const filename = `yskra-${new Date().toLocaleString(undefined, { dateStyle: 'short' })}.log`;
  const data = [];

  for (const { messages, meta } of Object.values(entries)) {
    if (messages.length === 0) {
      continue;
    }
    for (const { level, message, date } of messages) {
      data.push({
        date,
        level,
        message: logMessage2str(message),
        meta,
      });
    }
  }

  saveTextAsFile(
    filename,
    data
    // @ts-ignore
      .sort((a, b) => a.date - b.date)
      .map(({ date, level, message, meta }) =>
        `${date.toLocaleString(undefined, { timeStyle: 'medium' })} [${level}] ${meta.prefix}:${meta.context}: ${message.title} ${message.full}`,
      )
      .join('\n'),
  );
}

/** @import {EntryLevel, GroupMeta} from '@/modules/logger/Public'; */

import logMessage2str from '@/modules/logger/utils/logMessange2str.js';
import saveTextAsFile from '@/utils/saveTextAsFile.js';

/**
 * @param {{id: string; level: EntryLevel; meta: GroupMeta; message: unknown; date: Date}[]} rawData
 */
export default function saveLogs(rawData) {
  const filename = `yskra-${new Date().toLocaleString(undefined, { dateStyle: 'short' })}.log`;
  const data = rawData.map(({ message, date, ...rest }) => ({
    date: `${date.toLocaleString(undefined, { timeStyle: 'medium' })}.${date.getMilliseconds()}`,
    message: logMessage2str(message),
    ...rest,
  }));

  saveTextAsFile(
    filename,
    data
      .map(({ date, level, message, meta }) =>
        `${date} [${level}] ${meta.prefix}:${meta.context}: ${message.title} ${message.full ? `\n${message.full}` : ''}`,
      )
      .join('\n'),
  );
}

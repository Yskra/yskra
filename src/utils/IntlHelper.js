import { useI18n } from 'vue-i18n';


// noinspection JSUnusedGlobalSymbols
export default class IntlHelper {
  /**
   * Converts milliseconds to localized time
   * @param {number} ms
   * @param {number} firstBiggest take only the first big units. ex "1d 20h 40m" will take only the day and hours
   * @param {string} sep
   */
  static millisecondsToDHMS(ms, firstBiggest = 2, sep = ' ') {
    return splitTime(ms / 1000).slice(0, firstBiggest).join(sep);
  }

  /**
   * Convert Date to localized time
   * @param {Date} date
   * @param {number} firstBiggest take only the first big units. ex "1d 20h 40m" will take only the day and hours
   * @param {string} sep
   */
  static dateToHMS(date, firstBiggest = 2, sep = ' ') {
    const { t } = useI18n();
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    const result = [];

    if (h > 0) {
      result.push(t('hours', { v: h }));
    }
    if (m > 0) {
      result.push(t('minutes', { v: m }));
    }
    if (s > 0) {
      result.push(t('seconds', { v: s }));
    }

    return result.slice(0, firstBiggest).join(sep);
  }

  /**
   * @param {number} bytes
   */
  static bytes(bytes) {
    const { t } = useI18n();
    const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte'];

    if (bytes === 0) {
      return t('byte', { v: 0 });
    }

    const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024));
    const v = bytes / 1024 ** unitIndex;

    return t(units[unitIndex], { v: v.toFixed(2) });
  }

  /**
   * @param {number} bytes
   */
  static bytesSpeed(bytes) {
    const { t } = useI18n();

    return t('perSecond', { v: IntlHelper.bytes(bytes) });
  }
}

/**
 * @param {number} sec seconds
 * @returns {string[]} localized time
 */
function splitTime(sec) {
  const { t } = useI18n();
  const result = [];
  const days = Math.trunc(sec / 86400);
  const hours = Math.trunc((sec % 86400) / 3600);
  const minutes = Math.trunc((sec % 3600) / 60);
  const seconds = Math.trunc(sec % 60);

  if (days !== 0) {
    result.push(t('days', { v: days }));
  }
  if (hours !== 0) {
    result.push(t('hours', { v: hours }));
  }
  if (minutes !== 0) {
    result.push(t('minutes', { v: minutes }));
  }
  if (seconds !== 0) {
    result.push(t('seconds', { v: seconds }));
  }
  if (!result.length && sec) {
    result.push(t('seconds', { v: seconds }));
  }

  return result;
}

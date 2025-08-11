import { en2ru, ru2en } from './dict.js';

const RU_WORDS_REGEX = new RegExp(`[${escapeRegExp(Object.keys(ru2en).join(''))}]`, 'g');
const EN_WORDS_REGEX = new RegExp(`[${escapeRegExp(Object.keys(en2ru).join(''))}]`, 'g');

/**
 * @param {string} str *
 * @return {string}
 */
export default function keyboardLayoutSwitch(str) {
  if (RU_WORDS_REGEX.test(str)) {
    return str.replace(RU_WORDS_REGEX, (c) => ru2en[c]);
  }

  if (EN_WORDS_REGEX.test(str)) {
    return str.replace(EN_WORDS_REGEX, (c) => en2ru[c]);
  }

  return str;
}

/**
 * Escapes a string for use in a regular expression.
 * @param {string} str *
 * @return {*}
 */
function escapeRegExp(str) {
  return str.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

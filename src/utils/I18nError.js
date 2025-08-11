// noinspection RegExpRedundantEscape
const PAYLOAD_REGEX = /\{(\w+)\}/g;

export default class I18nError extends Error {
  constructor(/** @type {string} */ templateKey, /** @type {Record<string, any>} */ payload = {}) {
    super(formatTemplate(templateKey, payload));

    this.template = templateKey;
    this.payload = payload;
  }
}

/**
 * Compile template with payload for error message
 * @param {string} template template with placeholders
 * @param {Record<string, any>} payload payload for template
 * @returns {string} compiled template
 */
export function formatTemplate(template, payload = {}) {
  return template.replace(PAYLOAD_REGEX, (match, key) => {
    return payload[key] !== undefined ? String(payload[key]) : match;
  });
}

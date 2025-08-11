import I18nError from '@/utils/I18nError.js';
import validUrl from '@/utils/validUrl.js';

export default class SourceError extends I18nError {
  constructor(/** @type {string} */ templateKey, /** @type {Record<string, unknown>} */ payload, /** @type {string|URL} */ source) {
    super(templateKey, payload);
    this._source = source;
  }

  static extendFromI18n(/** @type {I18nError} */ error, /** @type {string|URL} */ source) {
    return new SourceError(error.template, error.payload, source);
  }

  get source() {
    if (this._source instanceof URL) {
      return this._source;
    }
    if (validUrl(this._source)) {
      return new URL(this._source);
    }

    return {
      pathname: this._source,
      href: this._source,
      toString: () => this._source,
    };
  }
}

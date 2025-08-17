/** @import {PluginManifest, PluginExecute} from './Public'; */
import I18nError from '@/utils/I18nError.js';
import { DOCS_URL, PLUGIN_REQUIRED_FIELDS } from './constants.js';


export class Plugin {
  /** @type {PluginManifest} */
  manifest;
  /** @type {PluginExecute} */
  execute;

  /**
   * @param {PluginManifest} manifestRaw manifest got from fetched plugin
   * @param {PluginExecute} execute execute function
   */
  constructor(manifestRaw, execute) {
    if (PLUGIN_REQUIRED_FIELDS.some((field) => typeof manifestRaw[field] === 'undefined')) {
      const list = PLUGIN_REQUIRED_FIELDS
        .filter((field) => typeof manifestRaw[field] === 'undefined')
        .map((field) => `"${field}"`)
        .join(', ');

      throw new I18nError(`Plugin manifest not has required fields: {list}. See {link} for details.`, { list, link: DOCS_URL.PLUGIN_MANIFEST.href });
    }

    this.execute = execute;
    this.manifest = manifestRaw;
  }

  /**
   * todo допилить
   * Get localized field from manifest or first from manifest
   * @param {keyof PluginManifest} field field name
   * @param {PluginManifest} manifest manifest
   * @returns {string} localized field
   */
  static getLocalizedField(field, manifest) {
    return manifest[field] ?? Object.entries(manifest).find(([k]) => k.startsWith(`${field}:`))?.[1];
  }
}

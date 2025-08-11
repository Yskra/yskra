/** @import {PluginManifest, PluginExecute} from '@/modules/pluginManager/Public'; */
/** @typedef {[PluginManifest, PluginExecute]} BuiltPlugin */
/** @typedef {Record<PluginManifest['id'], PluginManifest>} InstalledPlugin */

import { useFetch } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { Logger } from '@/modules/logger';
import { Plugin } from '@/modules/pluginManager/Plugin.js';
import { isJsDoc } from '@/modules/pluginManager/utils/manifestParse.js';
import ManifestParseWorker from '@/modules/pluginManager/workers/manifestParse.js?worker';
import Base64 from '@/utils/Base64.js';
import I18nError from '@/utils/I18nError';
import createThreadProcessor from '@/utils/threadProcessor.js';

const BUFFER_LIMIT = 10_000;

/**
 * @type {(raw: string) => Promise<PluginManifest|undefined>}
 */
const manifestParse = createThreadProcessor({ Worker: ManifestParseWorker });

/**
 * Fetch and build plugin from url
 * @param {string} src
 * @return {Promise<Plugin>}
 */
export async function pluginFromSource(src) {
  const { t } = useI18n();
  const { statusCode, response, error } = await useFetch(src);
  /** @type {string} */
  let textModule;

  if (error.value || statusCode.value !== 200) {
    throw new I18nError('Failed to fetch recurse {url} / {status}', { url: src, status: statusCode.value });
  }

  if (!response.value?.body) {
    throw new I18nError('Empty response body');
  }

  const textModuleResp = (response.value.headers.get('content-type')?.includes('text/plain')) ? response.value.clone() : null;
  const manifest = await manifestParseStream(response.value.body);

  if (!manifest) {
    throw new I18nError('Failed to parse manifest {url}', { url: src });
  }

  if (textModuleResp) {
    // like raw.githubusercontent.com
    (new Logger('PluginManager')).warn(t('Plugin\'s hosting {name} returned type \'text/plain\'. Attempt to load as base64', { name: manifest.name }));

    const text = await textModuleResp.text();

    textModule = `data:text/javascript;base64,${Base64.unicode2base64(text)}`;
  }

  return new Plugin(
    manifest,
    (...args) => import(/* @vite-ignore */ textModule ?? src).then((m) => m.default(...args)),
  );
}

/**
 * Parse manifest from a stream until JSDoc comment is found
 * @param {ReadableStream<Uint8Array>} stream
 * @return {Promise<PluginManifest | undefined>}
 */
export async function manifestParseStream(stream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();

  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });


      if (isJsDoc(buffer)) {
        return await manifestParse(buffer);
      }

      if (buffer.length > BUFFER_LIMIT) {
        break;
      }
    }
  }
  finally {
    reader.releaseLock();
  }
}

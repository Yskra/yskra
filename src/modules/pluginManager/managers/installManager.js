/** @import {PluginManifest, PluginExecute} from '@/modules/pluginManager/Public'; */
/** @import {Reactive, ComputedRef} from 'vue'; */
/** @import {Config} from '@/modules/Public'; */
/** @import {Logger} from '@/modules/logger/Logger'; */
/** @typedef {[PluginManifest, PluginExecute]} BuiltPlugin */
/** @typedef {Record<PluginManifest['id'], PluginManifest>} InstalledPlugin */

import { computed, shallowReactive, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { Plugin } from '@/modules/pluginManager/Plugin.js';
import SourceError from '@/modules/pluginManager/utils/SourceError';
import I18nError from '@/utils/I18nError';
import { pluginFromSource } from '../utils/pluginFromSource';

const builtPluginsImports = import.meta.glob(['@/plugins/*/main.js', '@/plugins/*/manifest.json'], {
  import: 'default',
  eager: true,
});

const localPluginsImports = import.meta.glob(['@localPlugins/*.js', '!@localPlugins/*.system.js'], {
  import: 'default',
  query: '?url',
});

/** @type {ComputedRef<BuiltPlugin[]>} */
// @ts-ignore
const builtPlugins = computed(() => Object.entries(builtPluginsImports)
  // @ts-ignore
  .reduce((acc, [fileName, manifest], _, arr) => {
    if (fileName.endsWith('.js')) {
      return acc;
    }
    const path = fileName.replace('/manifest.json', '');
    const module = arr.find(([f]) => f.startsWith(path))?.[1];

    return [...acc, [manifest, module]];
  }, [])
  .sort((/** @type {any} */ [a], /** @type {any} */ [b]) => (a?.mountOrder ?? 1) - (b?.mountOrder ?? 1)),
);


/**
 * @param {Logger} logger logger
 * @param {Config} config app config
 */
export function useInstallManager(logger, config) {
  const { t } = useI18n();

  /** @type {Reactive<InstalledPlugin>} */
  const installedPlugins = shallowReactive({});
  /** @type {SourceError[]} */
  const notLoadedSources = shallowReactive([]);

  return {
    installedPlugins: toRef(() => installedPlugins),
    notLoadedSources: toRef(() => notLoadedSources),

    initPlugin,
    isPluginInstalled,
    installPlugin,
    removePlugin,
    initBuilt,
    initLocal,
    initInstalled,
  };

  /**
   * @param {PluginManifest['id']} id *
   */
  function isPluginInstalled(id) {
    return id in installedPlugins;
  }

  /**
   * Create plugin with errors handling
   * @param {string} src url to *.js file
   * @param {PluginManifest['id']=} id if build-in plugin
   * @return {Promise<Plugin>}
   */
  async function initPlugin(src, id) {
    if (id && !src) {
      const builtInPlugin = builtPlugins.value.find(([m]) => m.id === id);

      if (builtInPlugin) {
        return new Plugin(...builtInPlugin);
      }
      else {
        throw new I18nError('Plugin {id} not found', { id });
      }
    }
    return pluginFromSource(src);
  }

  /**
   * @param {string} src url to *.js file
   */
  async function installPlugin(src) {
    const plugin = await initPlugin(src)
      .catch((err) => {
        logger.error(t(err.template, err.payload));
        return undefined;
      });

    if (plugin) {
      if (plugin.manifest.id in installedPlugins) {
        logger.warn(t('Plugin {id} ({url}) already installed', { id: plugin.manifest.id, url: src }));
        return;
      }
      installedPlugins[plugin.manifest.id] = plugin.manifest;
      config.value.pluginManager.installed.push(src);
      return plugin;
    }
  }

  /**
   * @param {PluginManifest['id']|PluginManifest['source']} idOrSource *
   */
  function removePlugin(idOrSource) {
    const installedOnConfig = config.value.pluginManager.installed;

    if (installedPlugins[idOrSource]) {
      const source = installedPlugins[idOrSource].source;
      const index = installedOnConfig.indexOf(source);

      if (index !== -1) {
        installedOnConfig.splice(index, 1);
      }

      delete installedPlugins[idOrSource];
      return;
    }

    const index = installedOnConfig.indexOf(idOrSource);

    if (index !== -1) {
      installedOnConfig.splice(index, 1);

      const notLoadedIndex = notLoadedSources.findIndex((s) => s.source.href === idOrSource);

      if (notLoadedIndex !== -1) {
        notLoadedSources.splice(notLoadedIndex, 1);
      }
    }
  }

  /**
   * Create built-in plugins on pluginManager startup
   * @return {Plugin[]}
   */
  function initBuilt() {
    return builtPlugins.value.map(([manifest, execute]) => {
      const plugin = new Plugin(manifest, execute);

      installedPlugins[manifest.id] = plugin.manifest;

      return plugin;
    });
  }

  /**
   * Create local plugins (@localPlugins/) on pluginManager startup
   * @return {Promise<Plugin[]>}
   */
  async function initLocal() {
    const [plugins] = await _urls2Plugins(Object.keys(localPluginsImports), (url, plugin) => {
      // valid url for local plugin not usually available - its generate by vite: like @fs/something/on/disk

      plugin.manifest.source = url; // bypass disable/enable errors
      installedPlugins[plugin.manifest.id] = { ...plugin.manifest };
    });

    return plugins;
  }

  /**
   * Create installed (user's) plugins on pluginManager startup
   * @return {Promise<Plugin[]>}
   */
  async function initInstalled() {
    const [plugins, errors] = await _urls2Plugins(config.value.pluginManager.installed, (url, plugin) => {
      // when source url changed (deprecated?) in manifest
      // update plugin source url in app config

      const id = plugin.manifest.id;
      const i = config.value.pluginManager.installed.indexOf(installedPlugins[id].source);

      config.value.pluginManager.installed.splice(i, 1);
      config.value.pluginManager.installed.push(url);
    });

    notLoadedSources.push(...errors);
    return plugins;
  }

  /**
   * @param {string[]} urls *
   * @param {(url: string, plugin: Plugin) => void} resolveSourceUrl call when source is different from on manifest
   * @return {Promise<[Plugin[], SourceError[]]>}
   */
  async function _urls2Plugins(urls, resolveSourceUrl) {
    const pluginsMap = urls
      .map(/** @return {Promise<Plugin|SourceError>} src */ async (src) => {
        const plugin = await initPlugin(src)
          .catch((/** @type {I18nError|Error} */ err) => err);

        if (plugin instanceof Plugin) {
          installedPlugins[plugin.manifest.id] = plugin.manifest;

          if (plugin.manifest.source !== src) {
            resolveSourceUrl(src, plugin);
          }

          return plugin;
        }
        if (plugin instanceof I18nError) {
          return SourceError.extendFromI18n(plugin, src);
        }
        return new SourceError(plugin.message, {}, src);
      });

    const plugins = await Promise.all(pluginsMap);

    return plugins.reduce(
      /**
       * Filter plugins and errors
       * @param {[Plugin[], SourceError[]]} acc *
       * @param {Plugin | SourceError} plugin *
       * @return {[Plugin[], SourceError[]]}
       */
      ([plugins, notLoaded], plugin) => {
        if (plugin instanceof Plugin) {
          return [[...plugins, plugin], notLoaded];
        }
        return [plugins, [...notLoaded, plugin]];
      },
      [[], []],
    );
  }
}

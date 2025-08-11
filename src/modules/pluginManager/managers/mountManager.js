/** @import {PluginContext, PluginManifest, App, PluginRuntime} from '@/modules/pluginManager/Public'; */
/** @import {Config, UserProfile} from '@/modules/Public'; */
/** @import {Plugin} from '@/modules/pluginManager/Plugin'; */
/** @import {EventHook} from '@vueuse/core'; */
/** @typedef {Record<PluginManifest['id'], PluginUnmount>} unmountPlugin */

import { createEventHook, reactify, useStyleTag } from '@vueuse/core';
import { reactive, ref, shallowReactive, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppBus } from '@/modules/appBus';
import { createPluginInjector } from '@/modules/pluginManager/utils/pluginInjector.js';
import { createPluginRouter } from '@/modules/pluginManager/utils/pluginRouter.js';
import StyleClearWorker from '@/modules/pluginManager/workers/styleClear.js?worker';
import { useVanillaRouter } from '@/modules/router';
import { addSettingsPluginPage } from '@/modules/settings';
import deepDiff from '@/utils/deepDiff.js';
import deepMerge from '@/utils/deepMerge.js';
import { deepToRaw } from '@/utils/deepToRaw.js';
import I81nError from '@/utils/I18nError';
import Logger from '@/utils/Logger.js';
import createThreadProcessor from '@/utils/threadProcessor.js';

/**
 * @type {(css: string) => Promise<string>}
 */
const styleClear = createThreadProcessor({ Worker: StyleClearWorker });

const reactiveDiff = reactify(deepDiff);

export class PluginUnmount {
  /** @type {(() => void)[]} */
  #callbacks = [];

  /**
   * @param {() => void} callback
   * @return {PluginUnmount}
   */
  step(callback) {
    this.#callbacks.push(callback);
    return this;
  }

  run() {
    this.#callbacks.forEach((callback) => callback());
  }
}

/**
 * @param {Logger} logger
 * @param {Config} config
 * @param {UserProfile} userProfile
 * @param {App} appInstance
 * @param {PluginRuntime} currentRuntime
 * @param {Record<PluginManifest['id'], Record<string, any>>} devtoolsConfigs
 */
export function useMountManager(logger, config, userProfile, appInstance, currentRuntime, devtoolsConfigs) {
  const { t } = useI18n();

  /** @type {import('vue').Reactive<unmountPlugin>} */
  const unmountsPlugin = shallowReactive({});
  /** @type {PluginManifest['id'][]} */
  const deadPlugins = shallowReactive([]);

  const pluginMounted = createEventHook();
  const pluginUnmounted = createEventHook();
  /** @type {EventHook<I81nError>} */
  const neededRestart = createEventHook();

  return {
    mountedPlugins: toRef(() => Object.keys(unmountsPlugin)),
    deadPlugins,

    isPluginMounted,
    mountPlugin,
    unmountPlugin,
    onPluginMounted: pluginMounted.on,
    onPluginUnmounted: pluginUnmounted.on,
    onNeededRestart: neededRestart.on,
  };

  /**
   * Check if plugin is mounted
   * @param {PluginManifest['id']} id
   */
  function isPluginMounted(id) {
    return id in unmountsPlugin;
  }
  /**
   * Mount plugin with errors handling and init unmount hooks
   * @param {Plugin} plugin
   */
  async function mountPlugin(plugin) {
    const { id, name, runtime } = plugin.manifest;

    if (runtime && runtime !== currentRuntime) {
      logger.warn(t('Plugin {name} is not compatible with current runtime: {runtime}', { name, runtime: currentRuntime }));
      return;
    }
    if (unmountsPlugin[id]) {
      logger.warn(t('Plugin {id} already mounted', { id }));
      return;
    }

    const unmount = new PluginUnmount();
    const context = getPluginContext(plugin.manifest, unmount);

    try {
      const ownUnmount = await plugin.execute(context);

      if (typeof ownUnmount === 'function') {
        unmount.step(ownUnmount);
      }
      else {
        unmount.step(() => neededRestart.trigger(new I81nError('Plugin {name} does not return unmount function', { name })));
      }
      unmountsPlugin[id] = unmount;
      await pluginMounted.trigger({ manifest: plugin.manifest });
    }
    catch (e) {
      logger.error(`${t('Failed to mount plugin {name}', { name })} | `, e);
      deadPlugins.push(id);
    }
  }

  /**
   * Unmount plugin and run unmount hooks
   * @param {PluginManifest['id']} id
   */
  function unmountPlugin(id) {
    if (unmountsPlugin[id]) {
      try {
        unmountsPlugin[id].run();
      }
      catch (e) {
        // noinspection JSIgnoredPromiseFromCall
        neededRestart.trigger(new I81nError('Errors occurred while unmounting {name}', { name: id }));
        logger.warn(e);
      }
      delete unmountsPlugin[id];

      // noinspection JSIgnoredPromiseFromCall
      pluginUnmounted.trigger({
        name: id,
      });
    }
  }

  /**
   * Create plugin context
   * @param {PluginManifest} manifest plugin manifest
   * @param {PluginUnmount} unmount register plugin unmount hooks
   * @return {PluginContext}
   */
  function getPluginContext(manifest, unmount) {
    const { name, id } = manifest;
    const pluginLogger = new Logger(`${name}`);
    const vanillaRouter = useVanillaRouter();
    const bus = useAppBus();
    const i18n = useI18n();

    // noinspection JSUnusedGlobalSymbols
    return {
      app: appInstance.value,
      router: createPluginRouter(pluginLogger, unmount),
      injector: createPluginInjector(pluginLogger, unmount),
      defineConfig,
      defineUserProfile,
      defineSettings,

      defineBusService,
      defineLocales,
      useStyle,
    };

    /** @type {PluginContext['defineConfig']} */
    function defineConfig(defaults) {
      const res = reactive(deepMerge(defaults, deepToRaw(config.value[id]) ?? {}));

      if (import.meta.env.DEV) {
        devtoolsConfigs[id] = res;
      }
      config.value[id] = reactiveDiff(defaults, res);
      return res;
    }

    /** @type {PluginContext['defineUserProfile']} */
    function defineUserProfile(defaults) {
      const res = reactive(deepMerge(defaults, deepToRaw(userProfile.value[id]) ?? {}));

      userProfile.value[id] = reactiveDiff(defaults, res);
      return res;
    }


    /** @type {PluginContext['defineSettings']} */
    function defineSettings(fieldsOrPage) {
      const fields = ref(fieldsOrPage);
      const routeName = `SETTINGS_${id}`;

      addSettingsPluginPage({
        name: routeName,
        meta: {
          title: name,
        },
        path: `plugin/${id}`,
        component: Array.isArray(fields.value) ? () => import('../components/PluginSettings.vue') : fieldsOrPage,
        props: { fields },
      });
      unmount.step(() => {
        vanillaRouter.removeRoute(routeName);
      });
    }

    /** @type {PluginContext['defineBusService']} */
    function defineBusService(name, service) {
      const unregister = bus.addService(name, service);

      unmount.step(unregister);

      return unregister;
    }

    /** @type {PluginContext['defineLocales']} */
    function defineLocales(locales) {
      Object.entries(locales).forEach(([language, message]) => {
        i18n.mergeLocaleMessage(language, message);
      });
    }

    /** @type {PluginContext['useStyle']} */
    function useStyle(css, options = {}) {
      const styleTag = useStyleTag(css, options);

      styleClear(styleTag.css.value).then((newCss) => {
        styleTag.css.value = newCss;
      });

      unmount.step(styleTag.unload);

      return styleTag;
    }
  }
}

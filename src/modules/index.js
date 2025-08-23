/** @import {Module, Config, UserProfiles, ModuleContext} from '@/modules/Public' */
/** @import {Plugin as VuePlugin, VNode, ComponentPublicInstance} from 'vue'; */

import { until } from '@vueuse/core';
import { computed, reactive, readonly, ref } from 'vue';
import { createEventBusModule } from '@/modules/appBus';
import { createComponentRegisterModule } from '@/modules/componentRegister';
import { createConfigEditorModule } from '@/modules/configEditor/index.js';
import { createI18nModule } from '@/modules/i18n';
import { createLoggerModule, Logger } from '@/modules/logger';
import { createPlatformModule } from '@/modules/platform';
import { createPluginManagerModule } from '@/modules/pluginManager';
import { createRouterModule } from '@/modules/router/';
import { createSettingsModule } from '@/modules/settings';
import { createStore } from '@/modules/store/index.js';
import createManualThenable from '@/utils/thenable.js';

const MAX_MODULE_WAIT_TIME = 10_000;

/** @type {Module[]} */
const modulesByOrder = [
  createEventBusModule, // no deps
  createRouterModule, // no deps. fixme: deps ui-kit plugin (index.vue)
  createPlatformModule, // no deps. // convert to plugin ? (settings module uses it and ui-kit)
  createStore, // no deps
  createSettingsModule, // deps: Platform, Store
  createI18nModule, //  no deps
  createPluginManagerModule, // deps:  Init, Platform, i18n, Bus, Router, Store
  createLoggerModule, // no deps
  createConfigEditorModule, // no deps
  createComponentRegisterModule, // no deps
];

/**
 * Load all app modules
 * @param {object} params *
 * @param {Config} params.config app config
 * @param {UserProfiles} params.userProfiles user profiles
 * @param {Set<VNode>} params.rootComponents root components of App.vue
 * @returns {VuePlugin} vue plugin
 */
export default function loadModules({ config, userProfiles, rootComponents }) {
  const componentLogger = new Logger('Vue');
  const initLogger = new Logger('Init');
  const canRequestRecoveryMode = ref(true);
  const isRecoveryMode = ref(false);
  const userProfile = computed(() => userProfiles.value[config.value.activeProfileIdx]);
  /** @type {Map<string, Promise<void>>} */
  const readyModules = reactive(new Map());

  if (config.value.activeProfileIdx > (userProfiles.value.length - 1)) {
    config.value.activeProfileIdx = 0;
  }

  return {
    install(app) {
      const ready = createManualThenable();
      const startTime = performance.now();
      /** @type {ModuleContext} */
      const moduleContext = {
        config,
        userProfile,
        isRecoveryMode: readonly(isRecoveryMode),
        requestRecoveryMode,
        awaitModules,
        rootComponents,
      };
      const exposeGlobal = {};

      readyModules.set('Init', Promise.resolve(ready.thenable));

      app.config.errorHandler = errorHandler;
      app.config.warnHandler = warnHandler;

      initializeModules(moduleContext, (module) => {
        Object.assign(exposeGlobal, module.global);
        app.use(module);
        module?.devtoolsPlugin?.(app);
      });

      attachGlobals(exposeGlobal);
      initLogger.info(`Done in ${(performance.now() - startTime).toFixed(1)}ms`);
      ready.resolve();
    },
  };

  /**
   * @param {ModuleContext} moduleContext module context
   * @param {(module: ReturnType<Module>) => void} onInstall on install callback
   */
  function initializeModules(moduleContext, onInstall) {
    const modules = new Map();

    for (const createModule of modulesByOrder) {
      const startTime = performance.now();
      const module = createModule(moduleContext);
      const name = module.displayName;
      const moduleReady = Promise.resolve(module.isReady);

      readyModules.set(name, moduleReady);

      modules.set(module, {
        name,
        createTime: performance.now() - startTime,
        ready: module.isReady ? moduleReady : undefined,
      });
    }

    canRequestRecoveryMode.value = false;

    for (const module of modules.keys()) {
      const startTime = performance.now();
      const stats = modules.get(module);

      onInstall(module);
      printModuleStat(stats.name, {
        create: stats.createTime,
        install: performance.now() - startTime,
      }, stats.ready);
    }
  }


  /**
   * @param {string} name *
   * @param {{ create: number; install: number; }} timings *
   * @param {Promise<void>=} ready *
   */
  function printModuleStat(name, timings, ready) {
    const total = timings.create + timings.install;
    const installStartTime = timings.install - performance.now();

    if (total > 0) {
      initLogger.info(
        `${name} install ${total.toFixed()}ms [`
        + `init: ${timings.create.toFixed()} ms, `
        + `install: ${timings.install.toFixed()}ms]`,
      );
    }

    if (ready) {
      ready.then(() =>
        initLogger.info(`${name} ready ${(performance.now() - installStartTime).toFixed()}ms`),
      );
    }
  }

  /**
   * @param {string[]} modules *
   */
  async function awaitModules(...modules) {
    const promises = [];

    for (const name of modules) {
      if (readyModules.has(name)) {
        promises.push(readyModules.get(name));
      }
      else {
        await until(readyModules).toMatch(
          (v) => v.has(name),
          { timeout: MAX_MODULE_WAIT_TIME, throwOnTimeout: true },
        );
        promises.push(readyModules.get(name));
      }
    }

    return Promise.allSettled(promises);
  }

  /**
   * @param {{}} globals *
   */
  function attachGlobals(globals) {
    Object.defineProperty(window, 'Yskra', {
      value: Object.freeze(globals),
      configurable: false,
      writable: false,
    });
  }

  /**
   * @param {unknown} err  *
   * @param {ComponentPublicInstance | null} instance  *
   * @param {string} info  *
   */
  function errorHandler(err, instance, info) {
    componentLogger.error(instance, `[${info}] | `, err);
  }

  /**
   * @param {unknown} err  *
   * @param {ComponentPublicInstance | null} instance  *
   * @param {string} info  *
   */
  function warnHandler(err, instance, info) {
    componentLogger.warn(instance, `[${info}] | `, err);
  }

  /**
   * @param {string} reason - reason for request
   */
  function requestRecoveryMode(reason) {
    if (!canRequestRecoveryMode.value) {
      throw new Error('Recovery mode is not allowed');
    }
    initLogger.warn(`Recovery mode requested: ${reason}.`);
    isRecoveryMode.value = true;
  }
}

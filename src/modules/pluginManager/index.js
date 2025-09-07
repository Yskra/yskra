/** @import {PluginManifest, PluginRuntime, App} from '@/modules/pluginManager/Public'; */
/** @import {ModuleContext} from '@/modules/Public' */
/** @import {Plugin} from '@/modules/pluginManager/Plugin'; */
// noinspection JSCheckFunctionSignatures
/* global System */

import { watchOnce } from '@vueuse/core';
import { h, hasInjectionContext, inject, ref, shallowReactive, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppBus } from '@/modules/appBus';
import { Logger } from '@/modules/logger';
import AcceptTOS from '@/modules/pluginManager/components/AcceptTOS.vue';
import { appPackageRegistry, BLACKLIST_EVENTS, BLACKLIST_TAGS, BLACKLIST_URLS, INJECT_KEY, PLUGIN_RUNTIME, PLUGIN_STATUS } from '@/modules/pluginManager/constants';
import { createInjectorModule } from '@/modules/pluginManager/lib/injector/index.js';
import { useEnableManager } from '@/modules/pluginManager/managers/disableManager.js';
import { useGlobalInterface } from '@/modules/pluginManager/managers/globalInterface.js';
import { useInstallManager } from '@/modules/pluginManager/managers/installManager.js';
import { useMountManager } from '@/modules/pluginManager/managers/mountManager.js';
import { useRepositoryManager } from '@/modules/pluginManager/managers/repositoryManager.js';
import { applyBlockElements, applyBlockEvents, applyBlockNetwork, applyFreezePrototypes, applyRemoveApis } from '@/modules/pluginManager/utils/globals.js';
import { patchCreateScriptTag, patchRegister } from '@/modules/pluginManager/utils/patchSystemJS.js';
import { addSettingsRootPage } from '@/modules/settings';
import compareVersions from '@/utils/compareVersions.js';
import createManualThenable from '@/utils/thenable.js';

/** @type {PluginRuntime} */
const pluginRuntime = 'System' in window ? PLUGIN_RUNTIME.SYSTEM : PLUGIN_RUNTIME.ES;

/** @type {ReturnType<typeof createPluginManagerModule>} */
let instance;

/**
 * @return {ReturnType<typeof createPluginManagerModule>}
 */
export function usePluginManager() {
  return instance || (hasInjectionContext() && inject(INJECT_KEY)) || {};
}

export {
  PLUGIN_RUNTIME,
  PLUGIN_STATUS,
  pluginRuntime,
};

/**
 * Load and manage app plugins
 * //@type {Module}
 * @param {ModuleContext} ctx module context
 * @docs ''
 */
export function createPluginManagerModule({ config, userProfile, isRecoveryMode, awaitModules }) {
  /** @type {App} */
  // @ts-ignore
  const appInstance = ref();
  const logger = new Logger('PluginManager');
  /** @type {Plugin[]} */
  const waitingMount = shallowReactive([]);
  /** @type {Record<PluginManifest['id'], Record<string, any>>} */
  const devtoolsConfigs = shallowReactive({});
  const bus = useAppBus();
  const { t } = useI18n();
  const ready = createManualThenable();

  createInjectorModule();

  const {
    initBuilt,
    initLocal,
    initInstalled,
    installPlugin,
    removePlugin,
    isPluginInstalled,
    initPlugin,
    installedPlugins,
    notLoadedSources,
  } = useInstallManager(logger, config);
  const {
    isPluginDisabled,
    enablePlugin,
    disablePlugin,
  } = useEnableManager(config);
  const {
    onPluginMounted,
    onPluginUnmounted,
    onNeededRestart,
    mountedPlugins,
    deadPlugins,
    isPluginMounted,
    mountPlugin,
    unmountPlugin,
  } = useMountManager(logger, config, userProfile, appInstance, pluginRuntime, devtoolsConfigs);
  const {
    addRepository,
    removeRepository,
    repositories,
  } = useRepositoryManager(config);
  const globalInterface = useGlobalInterface(logger, appPackageRegistry);


  const pluginManager = {
    displayName: 'PluginManager',

    devtoolsPlugin,
    install,

    global: globalInterface,

    pluginStatus: status,

    installPlugin: installAndMount,
    removePlugin: removeAndUnmount,

    enablePlugin: enableAndMount,
    disablePlugin: disableAndUnmount,

    isPluginInstalled,
    installedPlugins,
    notLoadedSources,

    addRepository,
    removeRepository,
    repositories,

    isReady: Promise.resolve(ready.thenable),
  };

  bus.addService('pluginManager.plugin', {
    mounted: { type: 'signal' },
    unmounted: { type: 'signal' },
  });

  onPluginMounted(({ manifest }) => {
    logger.info(t(`Plugin {name} mounted`, { name: `${manifest.name} [${manifest.id}]` }));
  });
  onPluginUnmounted(({ name }) => {
    logger.info(t(`Plugin {name} unmounted`, { name }));
  });
  onNeededRestart((error) => {
    const { onConfirm } = bus.call('ui.dialog:confirm', t('restartAppToApplyPlugins'));

    bus.call('ui.notices:pushNotification', {
      contentText: t(error.template, error.payload),
      icon: 'error',
    });
    onConfirm(() => {
      window.location.reload();
    });
    logger.warn(t(error.template, error.payload));
  });

  watchOnce(notLoadedSources, async (value) => {
    await awaitModules('I18nModule');

    bus.call('ui.notices:pushNotification', {
      contentTitle: t('Unable to load {target}', {
        target: t('{n} plugin | {n} plugins', value.length),
      }, value.length),
      contentText: value.map((s) => s.source.href).join(',  '),
      icon: 'error',
    });
  }, { deep: 1 });
  watchOnce(deadPlugins, async (value) => {
    await awaitModules('I18nModule');

    bus.call('ui.notices:pushNotification', {
      contentTitle: t('{target} started with errors', {
        target: t('{n} plugin | {n} plugins', value.length),
      }, value.length),
      contentText: value.map((id) => installedPlugins.value[id].name).join(',  '),
      icon: 'error',
    });
  });

  return pluginManager;

  /**
   * @param {App['value']} app app
   */
  function devtoolsPlugin(app) {
    if (import.meta.env.DEV) {
      import('@/modules/pluginManager/devtoolsPlugin.js').then(({ registerDevtoolsPlugin }) => {
        registerDevtoolsPlugin(app, pluginManager, config, devtoolsConfigs, {
          mountedPlugins,
          mountPlugin,
          unmountPlugin,
          initPlugin,
        });
      });
    }
  }

  /**
   * @param {App['value']} app app
   */
  function install(app) {
    appInstance.value = app;
    instance = pluginManager;
    let createScriptTag = () => document.createElement('script');

    if (isRecoveryMode.value) {
      return;
    }

    // @unocss-include
    addSettingsRootPage({
      path: 'plugins',
      name: 'settingsPlugins',
      component: () => import('@/modules/pluginManager/pages/SettingsPlugins.vue'),
      meta: {
        title: 'pluginsCatalog',
        icon: 'i-mingcute:plugin-2-fill',
      },
    });

    onPluginMounted(({ manifest }) => {
      bus.emit('pluginManager.plugin:mounted', { manifest });
    });
    onPluginUnmounted(({ name }) => {
      bus.emit('pluginManager.plugin:unmounted', { name });
    });

    // During a hot reload the top level local variable may get lost,
    // but in production I don't want to make the PluginManager like 'global'
    if (import.meta.env.DEV) {
      app.provide(INJECT_KEY, pluginManager);
    }
    if (import.meta.env.PROD) {
      const { createElement } = enableProtection();

      createScriptTag = () => createElement('script');
    }
    if ('System' in window) {
      const registry = Object.fromEntries(Object.entries(appPackageRegistry).map(([, pkg]) => [pkg.package, pkg.module]));

      patchRegister(System, registry);
      patchCreateScriptTag(System, createScriptTag);
    }

    awaitModules('Init', 'PlatformModule', 'I18nModule', 'Store', 'EventBus', 'Router')
      .then(() => {
        const builtMounted = initBuilt().map(async (plugin) => await tryMount(plugin));

        /** @type {Promise<void[]>} */
        let localMounted = Promise.resolve([]);
        /** @type {Promise<void[]>} */
        let installedMounted = Promise.resolve([]);

        localMounted = initLocal()
          .then((plugins) => plugins.map(tryMount))
          .then((p) => Promise.all(p));

        installedMounted = initInstalled()
          .then((plugins) => plugins.map(tryMount))
          .then((p) => Promise.all(p));

        Promise.all([...builtMounted, localMounted, installedMounted]).then(() => {
          ready.resolve();
        });
      });
  }

  function enableProtection() {
    const { createElement } = applyBlockElements(BLACKLIST_TAGS);

    applyRemoveApis();
    applyFreezePrototypes();
    applyBlockNetwork(BLACKLIST_URLS);
    applyBlockEvents(BLACKLIST_EVENTS);

    logger.info(t('Protection enabled'));

    return {
      createElement,
    };
  }

  /**
   * Safe mount plugin with resolve dependencies and checks
   * @param {Plugin=} plugin *
   */
  async function tryMount(plugin) {
    if (!plugin) {
      return;
    }

    if (isPluginDisabled(plugin.manifest.id)) {
      logger.info(t(`Skip disabled plugin {name}`, { name: plugin.manifest.name }));
      return;
    }

    if (!resolveDependencies(plugin.manifest)) {
      waitingMount.push(plugin);
      return;
    }

    await mountPlugin(plugin);

    for (const p of waitingMount) {
      if (resolveDependencies(p.manifest, plugin.manifest.id)) {
        waitingMount.splice(waitingMount.indexOf(p), 1);
        await tryMount(p);
      }
    }
  }

  /**
   * Safe unmount plugin with resolve dependencies
   * @param {PluginManifest['id']} id *
   */
  async function tryUnmount(id) {
    unmountPlugin(id);

    for (const mountedId of mountedPlugins.value) {
      const mounted = installedPlugins.value[mountedId];

      if (!resolveDependencies(mounted, id)) {
        await tryUnmount(mounted.id);
        // @ts-ignore
        waitingMount.push(await initPlugin(mounted.source, mounted.id));
      }
    }
  }

  /**
   * @param {PluginManifest} manifest *
   * @param {PluginManifest['id']=} [specificDependency] - specific dependency to check
   * @return {boolean} true if all dependencies or a specific dependency are installed and meet the version requirements
   */
  function resolveDependencies(manifest, specificDependency) {
    if (!manifest.dependencies) {
      return true;
    }

    const dependencies = specificDependency
      ? { [specificDependency]: manifest.dependencies[specificDependency] }
      : manifest.dependencies;

    for (const [dependency, requiredVersion] of Object.entries(dependencies)) {
      if (requiredVersion === undefined) {
        continue;
      }

      if (isPluginMounted(dependency)) {
        const installed = installedPlugins.value[dependency];

        if (!compareVersions(installed.version, requiredVersion)) {
          logger.error(t('Plugin {name} depends on {dependency} minimum version {requiredVersion}, but {dependency} is {installedVersion} version', {
            name: manifest.name,
            dependency,
            requiredVersion,
            installedVersion: installed.version,
          }));
          return false;
        }
      }
      else {
        return false;
      }
    }

    return true;
  }

  /**
   * Get current plugin status
   * @param {PluginManifest['id']} id *
   * @return {number} status if installed
   */
  function status(id) {
    if (mountedPlugins.value.includes(id)) {
      return PLUGIN_STATUS.OK;
    }
    if (waitingMount.some((p) => p.manifest.id === id)) {
      return PLUGIN_STATUS.DEPENDENCIES;
    }
    if (isPluginDisabled(id)) {
      return PLUGIN_STATUS.DISABLED;
    }
    if (deadPlugins.includes(id)) {
      return PLUGIN_STATUS.ERROR;
    }
    if (isPluginInstalled(id)) {
      return PLUGIN_STATUS.MOUNTING;
    }
    return PLUGIN_STATUS.UNKNOWN;
  }

  /**
   * Install and safe mount plugin
   * @param {string} src plugin url
   */
  async function installAndMount(src) {
    const accepted = await checkPluginTos();

    if (!accepted) {
      return;
    }
    const plugin = await installPlugin(src);

    await tryMount(plugin);
  }

  /**
   * Remove and safe unmount plugin, remove from disabled list if it was disabled
   * @param {PluginManifest['id']|PluginManifest['source']} idOrSource - only removePlugin supports remove by source, other functions will just check by id
   */
  function removeAndUnmount(idOrSource) {
    tryUnmount(idOrSource).then(() => {
      removePlugin(idOrSource);
      enablePlugin(idOrSource); // remove from disabled list if it was disabled

      if (idOrSource in config.value) {
        delete config.value[idOrSource];
      }
      if (idOrSource in userProfile.value) {
        delete userProfile.value[idOrSource];
      }
    });
  }

  /**
   * Enable and safe mount plugin
   * @param {PluginManifest['id']} id *
   */
  async function enableAndMount(id) {
    enablePlugin(id);
    const plugin = await initPlugin(installedPlugins.value[id].source, id);

    await tryMount(plugin);
  }

  /**
   * Disable and safe unmount plugin
   * @param {PluginManifest['id']} id *
   */
  function disableAndUnmount(id) {
    tryUnmount(id).then(() => {
      disablePlugin(id);
    });
  }

  /**
   * @return {Promise<boolean>}
   */
  async function checkPluginTos() {
    const pluginsTos = config.value.pluginManager.pluginsTos;

    if (pluginsTos.accepted || !pluginsTos.href) {
      return true;
    }

    return new Promise((resolve) => {
      const accepted = shallowRef(false);
      const dialog = bus.call('ui.dialog:modal', {
        title: t('warning'),
        body: h(AcceptTOS, {
          href: pluginsTos.href,
          onAccepted: (/** @type {boolean} */ result) => {
            accepted.value = result;
            dialog.close();
          },
        }),
      });

      dialog.onClose(() => {
        pluginsTos.accepted = accepted.value;
        resolve(accepted.value);
      });
    });
  }
}

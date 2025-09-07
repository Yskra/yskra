/** @import {Module, ConfigRaw} from '@/modules/Public' */

import { useBroadcastChannel, watchIgnorable } from '@vueuse/core';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppBus } from '@/modules/appBus';
import { useVanillaRouter } from '@/modules/router';
import { addSettingsRootPage } from '@/modules/settings';
import { deepToRaw } from '@/utils/deepToRaw.js';
import { Logger } from '../logger';

const BC_NAME = 'config_update';
/** @type {{onResetConfig: () => void}} */
let instance;

export function useConfigEditor() {
  return instance;
}

/**
 * @type {Module}
 * @docs ''
 */
export function createConfigEditorModule({ config, requestRecoveryMode, isRecoveryMode, awaitModules }) {
  const router = useVanillaRouter();
  const bus = useAppBus();
  const logger = new Logger('ConfigEditor');
  const { t } = useI18n();
  const { post, data: BCData } = useBroadcastChannel({ name: BC_NAME });
  const isConfigPath = config.value.router.mode === 'hash' ? window.location.hash.endsWith('/config') : window.location.pathname === '/config';

  instance = {
    onResetConfig,
  };

  if (isConfigPath) {
    requestRecoveryMode('open config editor');
  }

  return {
    displayName: 'ConfigEditor',
    install,
  };

  function install() {
    const appReady = ref(false);
    const { ignoreUpdates: ignoreUpdatesConfig } = watchIgnorable(config, (value) => {
      if (appReady.value && value) {
        sendUpdateConfig(value);
      }
    }, { deep: true });

    // update config in other tabs
    watch(BCData, (value) => {
      receiveConfig(value);

      ignoreUpdatesConfig(() => {
        config.value = value;
      });
    });

    // we wait for all plugins to fully load,
    // since plugins will write the default values of their configs once again and launch reactivity config
    awaitModules('PluginManager')
      .then(() => {
        appReady.value = true;
      });

    if (isConfigPath) {
      router.addRoute({
        path: '/config',
        props: {
          'config': config,
          'onUpdate:config': (/** @type {ConfigRaw} */ value) => {
            config.value = value;
            sendUpdateConfig(value);
          },
        },
        name: 'configEditor',
        component: () => import('@/modules/configEditor/pages/ConfigEditor.vue'),
      });

      router.isReady().then(() => {
        router.replace(router.currentRoute.value);
      });
    }
    else if (!isRecoveryMode.value) {
      // @unocss-include
      addSettingsRootPage({
        path: 'config',
        name: 'settingsConfigEditor',
        component: () => import('@/modules/configEditor/pages/SettingsConfigEditor.vue'),
        meta: {
          title: 'config',
          icon: 'i-mingcute:settings-7-fill',
        },
      });
    }
  }

  function sendUpdateConfig(/** @type {Partial<ConfigRaw>} */ value) {
    // logger.info('Send', JSON.parse(JSON.stringify(value)));

    try {
      post(deepToRaw(value));
    }
    // @ts-ignore
    catch (/** @type {Error} */ err) {
      bus.call('ui.notices:pushNotification', {
        contentTitle: t('errorSendToTabs'),
        contentText: err,
        icon: 'error',
      });
      post(null);
    }
  }

  /**
   * @param {ConfigRaw|null} value config
   */
  function receiveConfig(value) {
    logger.info('Receive', JSON.parse(JSON.stringify(value)));

    if (value === null) {
      window.location.reload();
    }
  }

  function onResetConfig() {
    // @ts-ignore
    config.value = {};

    sendUpdateConfig({});

    bus.call('ui.notices:pushNotification', {
      contentText: t('appWillRestart'),
      icon: 'error',
    });

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
}

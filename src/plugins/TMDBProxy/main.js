// noinspection JSValidateTypes
/** @import {PluginExecute} from '@/modules/pluginManager/Public'; */

import { computed, h, ref, watch } from 'vue';
import Settings from '@/plugins/TMDBProxy/pages/Settings.vue';
import STATUS from '@/plugins/TMDBProxy/status.js';
import { useAppBus } from '@/utils/appBus.js';

const TMDB_ENDPOINT = 'https://api.themoviedb.org/3';
/** @type {RequestInit} */
const checkHostOpts = { method: 'HEAD', redirect: 'manual' };

// noinspection JSUnusedGlobalSymbols
/** @type {PluginExecute} */
export default function plugin({ defineSettings, defineConfig }) {
  /** @type {import('vue').Ref<(typeof STATUS)[keyof typeof STATUS]>} */
  const status = ref(STATUS.INIT);
  const bus = useAppBus();
  const config = defineConfig({
    forceProxy: false,
    acceptedTos: false,
    apiUrl: '',
    imageCdn: '',
  });

  const apiEndpoint = computed(() => config.apiUrl.startsWith('/') ? new URL(config.apiUrl, window.location.origin) : new URL(config.apiUrl));
  const imageCdn = computed(() => config.imageCdn.startsWith('/') ? new URL(config.imageCdn, window.location.origin) : new URL(config.imageCdn));

  watch(config, checkConnection, { immediate: true });

  defineSettings(h(() => h(Settings, {
    status: status.value,
    forceProxy: config.forceProxy,
    onToggleForceProxy: () => config.forceProxy = !config.forceProxy,
    onTosAccepted: () => config.acceptedTos = true,
  })));

  return () => {
    if (status.value === STATUS.PROXY) {
      bus.call('tmdb.endpoints:set', { apiUrl: '', imageCdn: '' });
    }
  };

  async function checkConnection() {
    status.value = STATUS.INIT;

    const tmdbAvailable = config.forceProxy ? false : await fetch(TMDB_ENDPOINT, checkHostOpts).catch(() => false);

    if (tmdbAvailable) {
      status.value = STATUS.DIRECT;
      bus.call('tmdb.endpoints:set', { apiUrl: '', imageCdn: '' });
      return;
    }
    if (!config.acceptedTos) {
      status.value = STATUS.TOS_NOT_ACCEPTED;
      return;
    }
    const proxyAvailable = await fetch(config.apiUrl, checkHostOpts).catch(() => false);

    if (proxyAvailable) {
      status.value = STATUS.PROXY;
      bus.call('tmdb.endpoints:set', { apiUrl: apiEndpoint.value, imageCdn: imageCdn.value });
    }
    else {
      status.value = STATUS.PROXY_DEAD;
      bus.call('tmdb.endpoints:set', { apiUrl: '', imageCdn: '' });
    }
  }
}

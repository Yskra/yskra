// noinspection JSValidateTypes
/** @import {PluginExecute} from '@/modules/pluginManager/Public'; */

import { h, ref } from 'vue';
import Settings from '@/plugins/TMDBProxy/pages/Settings.vue';
import STATUS from '@/plugins/TMDBProxy/status.js';
import { useAppBus } from '@/utils/appBus.js';

const TMDB_ENDPOINT = 'https://api.themoviedb.org/3';
const PROXY_API_ENDPOINT = '';
const PROXY_IMAGE_CDN = '';

// noinspection JSUnusedGlobalSymbols
/** @type {PluginExecute} */
export default function plugin({ defineSettings }) {
  /** @type {import('vue').Ref<(typeof STATUS)[keyof typeof STATUS]>} */
  const status = ref(STATUS.INIT);
  const bus = useAppBus();

  fetch(TMDB_ENDPOINT).then(
    () => {
      status.value = STATUS.DIRECT;
    },
    () => {
      fetch(PROXY_API_ENDPOINT).then(
        () => {
          status.value = STATUS.PROXY;
          bus.call('tmdb.endpoints:set', { apiUrl: PROXY_API_ENDPOINT, imageCdn: PROXY_IMAGE_CDN });
        },
        () => {
          status.value = STATUS.PROXY_DEAD;
        },
      );
    },
  );

  defineSettings(h(() => h(Settings, { status: status.value })));

  return () => {
    if (status.value === STATUS.PROXY) {
      bus.call('tmdb.endpoints:set', { apiUrl: '', imageCdn: '' });
    }
  };
}

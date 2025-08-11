// noinspection JSUnusedGlobalSymbols
/** @import {PluginManifest, PluginInfo} from '@/modules/pluginManager/Public'; */
/** @import {Ref, ComputedRef, UnwrapRef} from 'vue'; */
/** @import {UseFetchReturn} from '@vueuse/core'; */
/** @typedef {Ref<UnwrapRef<UseFetchReturn<any>[]>>} Fetched */
/** @typedef {ComputedRef<Record<PluginManifest['id'], PluginManifest>>} PluginsCatalog */

import { useFetch } from '@vueuse/core';
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppBus } from '@/modules/appBus/index.js';
import { Logger } from '@/modules/logger';
import { usePluginManager } from '@/modules/pluginManager';
import { Plugin } from '@/modules/pluginManager/Plugin.js';
import SourceError from '@/modules/pluginManager/utils/SourceError.js';
import I18nError from '@/utils/I18nError.js';
import validUrl from '@/utils/validUrl.js';
import { pluginFromSource } from '../utils/pluginFromSource';

const CHECK_HEADERS_TIMEOUT = 5000;


export function useSettingsPluginsPage() {
  const { repositories, addRepository, removeRepository, installedPlugins, installPlugin, pluginStatus, isPluginInstalled, removePlugin, enablePlugin, disablePlugin } = usePluginManager();
  const bus = useAppBus();
  const { t } = useI18n();
  const showPluginInfo = ref(false);
  const showPluginInfo2 = ref(false);
  const showPluginInfoTarget = ref();
  /** @type {Ref<PluginInfo>} */
  const pluginInfo = ref({
    author: '',
    canDisable: false,
    canRemove: false,
    description: '',
    id: '',
    isInstalled: false,
    name: '',
    source: '',
    status: -1,
    version: '',
    apiVersion: 0,
    install: () => void 0,
    remove: () => void 0,
    enable: () => void 0,
    disable: () => void 0,
  });
  const pluginInfo2 = ref({
    canRemove: false,
    remove: () => void 0,
  });
  const sourceError = ref(new SourceError(' ', {}, ''));
  /** @type {Fetched} */
  const fetched = ref([]);
  const logger = new Logger('PluginManager');

  const repos = computed(() => fetched.value.map(({ data, error, isFetching }, index) => ({
    name: !data ? null : data.name,
    pluginsLength: !data ? 0 : data.plugins.length,
    url: repositories.value[index],
    isFetching,
    error,
  })));
  /** @type {PluginsCatalog} */
  const pluginsCatalog = computed(() => Object.fromEntries(
    fetched.value
      .map(({ data }) => data
        ? data.plugins
            .filter((/** @type {PluginManifest} */ m) => !(m.id in installedPlugins.value))
            .map((/** @type {PluginManifest} */ m) => [m.id, m])
        : [],
      )
      .flat(),
  ));

  watch(repositories, (value) => {
    fetched.value = reactive(value.map((r) => useFetch(r, {
      afterFetch(ctx) {
        ctx.data.plugins = ctx.data.plugins ?? [];
        return ctx;
      },
    }).get().json()));
  }, { deep: true, immediate: true });


  return {
    showPluginInfo,
    showPluginInfo2,
    showPluginInfoTarget,
    pluginInfo,
    pluginInfo2,
    sourceError,
    repos,
    pluginsCatalog,
    add,
    rmRepo,
    getPluginName,
    openPluginInfo,
    openPluginInfo2,
  };


  /**
   * @param {Event} event
   */
  function add(event) {
    const { onConfirm } = bus.call('ui.dialog:prompt', {
      text: t('linkToPluginOrRepo'),
      placeholder: 'https://raw.githubusercontent.com/...',
      validator,
      // @ts-ignore
      targetRef: event.target,
    });

    onConfirm(async (/** @type {string} */ value) => {
      const { response } = await useFetch(value, { timeout: CHECK_HEADERS_TIMEOUT }).head();

      if (response.value && response.value.status === 200) {
        if (response.value.headers.get('content-type') === 'application/json') {
          addRepository(value);
          return;
        }
      }
      const plugin = await pluginFromSource(value)
        .catch((/** @type {Error} */ err) => err);

      if (plugin instanceof Error) {
        const error = plugin instanceof I18nError ? SourceError.extendFromI18n(plugin, value) : new SourceError(plugin.message, {}, value);

        openPluginInfo2(error, event, {
          canRemove: false,
        });

        return;
      }

      openPluginInfo(plugin.manifest, event);
    });

    /**
     * @param {string} str
     */
    async function validator(str) {
      if (!str.trim()) {
        return t('notBeEmpty');
      }
      if (!validUrl(str)) {
        return t('invalidLink');
      }
      const { error, aborted, statusCode } = await useFetch(str, { timeout: CHECK_HEADERS_TIMEOUT }).head();

      if (error.value) {
        if (aborted.value) {
          return t('timeout');
        }
        return t('notBeLoaded', { error: `${error.value}. ${statusCode.value}` });
      }
    }
  }

  /**
   * @param {string} href
   * @param {string} name
   * @param {Event} event
   */
  function rmRepo(href, name, event) {
    const { onConfirm } = bus.call('ui.dialog:confirm', {
      text: t('doRemoveRepo', { name: name ?? href }),
      /** @type {Element|null} */
      // @ts-ignore
      targetRef: event.target,
    });

    onConfirm(() => {
      removeRepository(href);
    });
  }

  /**
   * @param {string} id
   */
  function getPluginName(id) {
    return installedPlugins.value[id]?.name ?? pluginsCatalog.value[id]?.name ?? id;
  }

  /**
   * @param {PluginManifest} manifest
   * @param {Event} event
   */
  function openPluginInfo(manifest, event) {
    pluginInfo.value = pluginManifest2Info(manifest);
    showPluginInfo.value = true;
    showPluginInfoTarget.value = event.target;
  }

  /**
   * @param {SourceError} error
   * @param {Event} event
   * @param {Partial<typeof pluginInfo2.value>} params
   */
  function openPluginInfo2(error, event, params = {}) {
    sourceError.value = error;
    pluginInfo2.value = {
      canRemove: true,
      remove: () => {
        const { href } = error.source;
        const { onConfirm } = bus.call('ui.dialog:confirm', t('doRemovePlugin', { name: href }));

        onConfirm(() => {
          removePlugin(href);
          showPluginInfo2.value = false;
        });
      },
      ...params,
    };
    showPluginInfo2.value = true;
    showPluginInfoTarget.value = event.target;

    logger.error(error);
  }

  /**
   * @param {PluginManifest} plugin
   * @returns {PluginInfo}
   */
  function pluginManifest2Info(plugin) {
    const canDisable = !!plugin.source || !!plugin.flags?.includes('SafeDisable');
    const canRemove = !!plugin.source;

    return reactive({
      ...plugin,
      status: computed(() => pluginStatus(plugin.id)),
      description: Plugin.getLocalizedField('description', plugin),
      formatDependencies: plugin?.dependencies ? formatDeps(plugin.dependencies) : undefined,
      isInstalled: computed(() => isPluginInstalled(plugin.id)),
      canRemove,
      canDisable,
      install: () => installPlugin(plugin.source),
      remove: () => {
        if (!canRemove) {
          return;
        }
        const { onConfirm } = bus.call('ui.dialog:confirm', t('doRemovePlugin', { name: plugin.name }));

        onConfirm(() => removePlugin(plugin.id));
      },
      enable: () => enablePlugin(plugin.id),
      disable: () => {
        if (!canDisable) {
          return;
        }
        disablePlugin(plugin.id);
      },
    });

    /**
     * @param {Record<PluginManifest['id'], PluginManifest['version']>} data
     */
    function formatDeps(data) {
      return Object.entries(data)
        .map(([n, v]) => `${getPluginName(n)} ${v}`)
        .join(', ');
    }
  }
}

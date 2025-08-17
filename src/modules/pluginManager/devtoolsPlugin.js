/** @import {PluginManager, PluginManifest, DevToolsPluginServiceFields} from './Public'; */
/** @import {Config} from '@/modules/Public'; */
/** @import {App} from 'vue' */

import { setupDevtoolsPlugin } from '@vue/devtools-api';
import { watch } from 'vue';
import Icon from './assets/folder-plugins.svg?no-inline';
import { DOCS_URL, PLUGIN_STATUS } from './constants.js';

const INSPECTOR_ID = 'pluginManager';

const tag = {
  textColor: 0xFFFFFF,
  backgroundColor: 0x737FFF,
};

const statusMap = {
  [-1]: { label: '', ...tag },
  [-2]: { label: 'unmounted', ...tag },
  [PLUGIN_STATUS.OK]: { label: '', ...tag },
  [PLUGIN_STATUS.DISABLED]: { label: 'Disabled', ...tag },
  [PLUGIN_STATUS.DEPENDENCIES]: { label: 'Dependencies', ...tag },
  [PLUGIN_STATUS.ERROR]: { label: 'Error', ...tag },
};

/**
 * @param {App<Element>} app app instance
 * @param {PluginManager} pluginManager pluginManager
 * @param {Config} config app config
 * @param {Record<PluginManifest['id'], Record<string, any>>} devtoolsConfigs devtools data
 * @param {DevToolsPluginServiceFields} service service
 */
export function registerDevtoolsPlugin(app, pluginManager, config, devtoolsConfigs, service) {
  setupDevtoolsPlugin({
    id: INSPECTOR_ID,
    label: 'Plugin Manager',
    logo: Icon,
    homepage: DOCS_URL.PLUGIN_MANAGER_MODULE.href,
    disableAppScope: true,
    app,
  }, (api) => {
    watch(pluginManager.installedPlugins.value, () => {
      api.sendInspectorTree(INSPECTOR_ID);
    });

    // @todo какая-то хрень с реактивностью тегов
    watch([config.value, service.mountedPlugins], () => {
      api.sendInspectorState(INSPECTOR_ID);
    }, { deep: true });

    api.addInspector({
      id: INSPECTOR_ID,
      label: 'Plugin Manager',
      nodeActions: [
        {
          icon: 'power',
          tooltip: 'Mount/Unmount plugin',
          action: async (nodeId) => {
            if (service.mountedPlugins.value.includes(nodeId)) {
              service.unmountPlugin(nodeId);
            }
            else {
              const plugin = await service.initPlugin(pluginManager.installedPlugins.value[nodeId].source, nodeId);

              if (plugin) {
                service.mountPlugin(plugin);
              }
            }
          },
        },
      ],
    });

    api.on.getInspectorTree((payload) => {
      if (payload.inspectorId === INSPECTOR_ID) {
        payload.rootNodes = Object.values(pluginManager.installedPlugins.value).map((p) => {
          const isMounted = service.mountedPlugins.value.includes(p.id);
          const pluginStatus = pluginManager.pluginStatus(p.id) ?? -1;

          return {
            id: p.id,
            label: p.name,
            // @ts-ignore
            tags: [statusMap[isMounted ? pluginStatus : -2]],
          };
        },
        );
      }
    });

    api.on.getInspectorState((payload) => {
      if (payload.inspectorId === INSPECTOR_ID) {
        // noinspection JSIgnoredPromiseFromCall
        api.unhighlightElement();

        payload.state = {
          'config': Object.entries(devtoolsConfigs[payload.nodeId] ?? []).map(([key, value]) => ({
            key,
            value,
            editable: true,
          })),
          'saved config': Object.entries(config.value[payload.nodeId] ?? []).map(([key, value]) => ({
            key,
            value,
          })),
        };
      }
    });

    api.on.editInspectorState((payload) => {
      if (payload.inspectorId === INSPECTOR_ID) {
        devtoolsConfigs[payload.nodeId][payload.path[0]] = payload.state.value;
      }
    });
  });
}

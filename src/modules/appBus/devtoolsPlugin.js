// @ts-nocheck
/** @import BaseBus from '@/modules/appBus/BaseBus.js'; */
/** @import {App} from 'vue' */

import { setupDevtoolsPlugin } from '@vue/devtools-api';
import { toRef, watch } from 'vue';
import { DOCUMENTATION_BUS_URL } from '@/constants.js';
import Icon from './assets/tour-bus.svg?no-inline';

const INSPECTOR_ID = 'appBus';

/**
 * @param {App<Element>} app app instance
 * @param {BaseBus<AppBusRegistry>} bus bus instance
 */
export function registerDevtoolsPlugin(app, bus) {
  setupDevtoolsPlugin({
    id: 'AppBus',
    label: 'App Bus',
    logo: Icon,
    homepage: DOCUMENTATION_BUS_URL,
    disableAppScope: true,
    app,
  }, (api) => {
    watch(() => bus.services, () => {
      api.sendInspectorTree(INSPECTOR_ID);
    });

    api.addInspector({
      id: INSPECTOR_ID,
      label: 'App Bus',
    });

    api.on.getInspectorTree((payload) => {
      if (payload.inspectorId === INSPECTOR_ID) {
        payload.rootNodes = Object.keys(bus.services).map((key) => ({
          id: key,
          label: key,
        }));
      }
    });

    api.on.getInspectorState((payload) => {
      if (payload.inspectorId === INSPECTOR_ID) {
        const { methods, signals, properties } = bus.services[payload.nodeId];

        // noinspection JSIgnoredPromiseFromCall
        api.unhighlightElement();

        payload.state = {
          methods: Array.from(methods).map(([key, value]) => ({ key, value })),
          signals: Array.from(signals).map(([key, value]) => ({ key, value: `subscribers: ${value.size}` })),
          properties: Array.from(properties).map(([key, value]) => ({ key, value: toRef(value)?.value })),
        };
      }
    });
  });
}

/** @import {Module} from '@/modules/Public' */
/** @import {AppBusInstance} from './Public'; */

import { hasInjectionContext, inject } from 'vue';
import BaseBus from '@/modules/appBus/BaseBus.js';
import { INJECT_KEY } from '@/modules/appBus/constans.js';
import { Logger } from '@/modules/logger';

/** @type {AppBusInstance} */
let instance;

/**
 * @return {AppBusInstance}
 */
export function useAppBus() {
  return instance || (hasInjectionContext() && inject(INJECT_KEY));
}

/**
 * Bus-like communication between components and modules
 * @type {Module}
 * @docs ''
 */
export function createEventBusModule() {
  const logger = new Logger('AppBus');
  const bus = new BaseBus(logger);
  const publicBus = {
    addService: bus.addService.bind(bus),
    call: bus.call.bind(bus),
    emit: bus.emit.bind(bus),
    on: bus.on.bind(bus),
    off: bus.off.bind(bus),
    set: bus.set.bind(bus),
    get: bus.get.bind(bus),
  };

  // @ts-ignore
  instance = publicBus;

  return {
    displayName: 'EventBus',

    devtoolsPlugin(app) {
      if (import.meta.env.DEV) {
        import('@/modules/appBus/devtoolsPlugin.js').then(({ registerDevtoolsPlugin }) => {
          registerDevtoolsPlugin(app, bus);
        });
      }
    },

    install(app) {
      app.provide(INJECT_KEY, publicBus);
    },
  };
}

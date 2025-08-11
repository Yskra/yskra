/** @import {Module} from '@/modules/Public' */
/** @import {VNode} from 'vue' */
import { useAppBus } from '@/modules/appBus';
import { register } from './register.js';

/**
 * @type {Module}
 */
export function createComponentRegisterModule({ rootComponents }) {
  const bus = useAppBus();

  return {
    displayName: 'ComponentRegisterModule',

    install() {
      bus.addService('rootComponent', {
        add: (/** @type {VNode} */ component) => {
          rootComponents.add(component);
          return () => rootComponents.delete(component);
        },
        delete: (/** @type {VNode} */ component) => rootComponents.delete(component),
      });
    },

    global: {
      componentRegister: register,
    },
  };
}

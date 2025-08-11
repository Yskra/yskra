/** @import {PluginUnmount} from '@/modules/pluginManager/managers/mountManager'; */
/** @import {StoreDefinition, SubscriptionCallbackMutation} from 'pinia'; */
/** @import {UnwrapRef, DebuggerEvent} from 'vue'; */
/** @typedef {Map<DebuggerEvent['target'], (() => void)[]>} MutationStore */
// noinspection JSMismatchedCollectionQueryUpdate, JSValidateTypes,JSCheckFunctionSignatures

import { MutationType } from 'pinia';
import { isRef } from 'vue';

/** @type {Record<string, Record<string, StoreDefinition>>} */
const storesImports = import.meta.glob('@/stores/**/*.js', {
  eager: true,
});

/**
 * @param {PluginUnmount} unmountPlugin unmount plugin util
 * @returns {Record<string, StoreDefinition>} something
 */
export function createPluginStores(unmountPlugin) {
  // @ts-ignore
  return Object.freeze(
    Object.fromEntries(
      Object.entries(storesImports).map(([, module]) => [
        Object.keys(module)[0],
        warpStore(module[Object.keys(module)[0]]),
      ]),
    ),
  );

  /**
   * @param {StoreDefinition} useStore store
   */
  function warpStore(useStore) {
    /** @type {() => void} */
    let unsubscribe;
    /** @type {MutationStore} */
    const mutationStore = new Map();

    unmountPlugin.step(() => {
      if (unsubscribe) {
        unsubscribe();

        for (const [,element] of mutationStore) {
          for (const callback of element) {
            callback();
          }
        }
      }
    });

    return (/** @type {Parameters<StoreDefinition>[]} */ ...args) => {
      // @ts-ignore
      const store = useStore(...args);

      if (!unsubscribe) {
        const subscribeCallback = initSubscribeCallback(mutationStore);

        unsubscribe = store.$subscribe(subscribeCallback, { detached: true });
      }

      return store;
    };
  }
}

/**
 * @param {MutationStore} mutationStore store
 * @returns {(mutation: SubscriptionCallbackMutation<any>, state: UnwrapRef<any>) => void} subscribe callback
 */
function initSubscribeCallback(mutationStore) {
  return ({ events, type }, state) => {
    if (type === MutationType.patchObject || type === MutationType.patchFunction) {
      events.forEach(handleEvent);
    }
    if (type === MutationType.direct) {
      handleEvent(events);
    }

    /**
     * @param {DebuggerEvent} event event
     */
    function handleEvent(event) {
      if (!mutationStore.has(event.target)) {
        mutationStore.set(event.target, []);
      }

      /** @type {(() => void)[]} */
      // @ts-ignore
      const mutation = mutationStore.get(event.target);
      const getKey = () => Array.isArray(event.target) ? event.target.indexOf(event.newValue) : event.key;

      switch (event.type) {
        case 'set':
          mutation.push(() => {
            if (typeof event.target === 'object') {
              const key = getKey();

              // @ts-ignore
              event.target[key] = event.oldValue;
            }
            if (isRef(event.target)) {
              state[event.key] = event.oldValue;
            }
          });
          break;

        case 'add':
          mutation.push(() => {
            if (typeof event.target === 'object') {
              const key = getKey();

              if (Array.isArray(event.target)) {
                event.target.splice(key, 1);
              }
              else {
                // @ts-ignore
                delete event.target[key];
              }
            }
          });
          break;

        case 'delete':
          mutation.push(() => {
            if (typeof event.target === 'object') {
              const key = getKey();

              // @ts-ignore
              event.target[key] = event.oldValue;
            }
          });
          break;

        // case 'clear': // ???
        //   break;
      }
    }
  };
}

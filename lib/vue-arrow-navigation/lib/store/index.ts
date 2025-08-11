import type { ComponentInternalInstance, MaybeRefOrGetter, Plugin } from 'vue';
import type { SectionConfig } from '../config';
import type { Storage, StorageValue, StoreInstance } from './Public';
import { inject, reactive, readonly, toRef } from 'vue';
import { FOCUSED_SELECTIONS_INJECT_KEY } from './constants';

export type { StorageValue } from './Public';

export function createStore(): Plugin & { storage: Storage } {
  const storage: Storage = reactive(new Map<Element, StorageValue>());
  const instance: StoreInstance = reactive({
    storage,
    getSection,
    initFocusSection,
    removeFocusSection,
  });

  return {
    install(app) {
      app.provide(FOCUSED_SELECTIONS_INJECT_KEY, instance);
    },
    storage,
  };

  function getSection(element: Element, config: MaybeRefOrGetter<SectionConfig>): StorageValue {
    config = toRef(config);

    if (!storage.has(element)) {
      storage.set(element, {
        children: new Set<HTMLElement>(),
        config: config.value,
        instance: {
          devtoolsNodeId: generateId(),
          defaultFocus: null,
        },
      });
    }
    return storage.get(element)!;
  }

  function initFocusSection(element: Element, config: MaybeRefOrGetter<SectionConfig>) {
    const { children, instance } = getSection(element, config);

    return {
      children: readonly(children),
      addChildren: (c: HTMLElement, isDefault = false) => {
        children.add(c);
        if (isDefault) {
          instance.defaultFocus = c;
        }
      },
      delChildren: (c: HTMLElement) => children.delete(c),
    };
  }

  function removeFocusSection(element: Element) {
    storage.delete(element);
  }
}

export function useStore(instance?: ComponentInternalInstance): StoreInstance {
  if (instance) {
    // @ts-expect-error it has provides!
    return instance.provides[FOCUSED_SELECTIONS_INJECT_KEY] as StoreInstance;
  }

  return inject(FOCUSED_SELECTIONS_INJECT_KEY) as StoreInstance;
}

function generateId(): string {
  return `${Math.random().toString(36).substring(2, 15)}`;
}

/** @import {UINotification} from './Public' */
/** @import {UUID} from 'node:crypto'; */

import { acceptHMRUpdate, defineStore } from 'pinia';
import { shallowReactive } from 'vue';
import generateUUID from '@/utils/generateUUID.js';

// todo tmp
const config = {
  notifications: {
    timeout: 10_000,
    maxElements: 4,
  },
};

export const useNoticesStore = defineStore('ui.notices', () => {
  /** @type {Map<UUID, UINotification>} */
  const notifications = shallowReactive(new Map());
  /** @type {Map<UUID, UINotification>} */
  const queue = shallowReactive(new Map());

  return {
    notifications,
    queue,
    pushNotification,
    removeNotification,
  };

  /**
   * @param {UINotification} notification
   * @returns {UUID} id of notification for manual remove
   */
  function pushNotification(notification) {
    const id = generateUUID();

    if (notifications.size < config.notifications.maxElements) {
      notifications.set(id, notification);
    }
    else {
      queue.set(id, notification);
    }

    return id;
  }

  /**
   * @param {UUID} id
   */
  function removeNotification(id) {
    if (notifications.has(id)) {
      notifications.delete(id);

      if (notifications.size < config.notifications.maxElements && queue.size > 0) {
        // @ts-ignore
        const [newId, newNotification] = queue.entries().next().value;

        queue.delete(newId);
        notifications.set(newId, newNotification);
      }
      return;
    }

    if (queue.has(id)) {
      queue.delete(id);
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNoticesStore, import.meta.hot));
}

/** @import {ComputedRef} from 'vue'; */
/** @import {FilmCardAction} from './Public'; */
/** @typedef { { id: string } } ActionOrderItem */

import { Icon } from '@icon';
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia';
import { computed, h, reactive, readonly, watch } from 'vue';
import { useUIKitConfigStore } from '../../libConfig';

// @unocss-include

export const useFilmCardStore = defineStore('ui.filmCard', () => {
  const { config } = storeToRefs(useUIKitConfigStore());
  /** @type {FilmCardAction[]} */
  const actions = reactive([]);
  /** @type {ComputedRef<ActionOrderItem[]>} */
  const actionsOrder = computed(() => {
    const order = config.value.filmCard.actionsOrder;

    return order.length > 0 ? order : actions.map((a) => ({ id: a.id }));
  });

  initDefaultActions();

  watch(
    () => config.value.filmCard.actionsOrder,
    (newOrder) => {
      if (newOrder.length === 0) {
        config.value.filmCard.actionsOrder = actions.map((a) => ({ id: a.id }));
      }
    },
  );

  return {
    actions: readonly(actions),
    actionsOrder,

    useOrderedActions,
    addAction,
    removeAction,
    getAction,
    moveAction,
  };

  function initDefaultActions() {
    const defaultActions = [
      {
        id: 'follow',
        name: 'В избранное',
        icon: h(Icon, { name: 'line-md-heart-filled' }),
        isAvailable: () => true,
        action: () => {},
      },
    ];

    defaultActions.forEach((action) => {
      if (!actions.some((a) => a.id === action.id)) {
        actions.push(action);
      }
    });
  }

  /**
   * Sort actions by order
   * @param {FilmCardAction[]=} additionalActions
   * @returns {FilmCardAction[]} ordered actions
   */
  function useOrderedActions(additionalActions = []) {
    const orderMap = new Map(
      actionsOrder.value.map((item, index) => [item.id, index]),
    );

    return [...actions, ...additionalActions].toSorted((a, b) => {
      const indexA = orderMap.get(a.id) ?? Infinity;
      const indexB = orderMap.get(b.id) ?? Infinity;

      return indexA - indexB;
    });
  }

  /**
   * Add new action button
   * @param {FilmCardAction} action
   * @returns {() => boolean} remove action
   */
  function addAction(action) {
    if (actions.some((a) => a.id === action.id)) {
      console.warn(`Action with id "${action.id}" is already registered.`);
      return () => false;
    }

    actions.push(action);

    if (!config.value.filmCard.actionsOrder.some((item) => item.id === action.id)) {
      config.value.filmCard.actionsOrder.push({ id: action.id });
    }

    return () => removeAction(action.id);
  }

  /**
   * Remove action by id
   * @param {string} id
   * @returns {boolean} is success remove
   */
  function removeAction(id) {
    const index = actions.findIndex((a) => a.id === id);

    if (index !== -1) {
      actions.splice(index, 1);
      config.value.filmCard.actionsOrder = actionsOrder.value.filter((item) => item.id !== id);
      return true;
    }
    return false;
  }

  /**
   * get action by id
   * @param {string} id
   * @returns {FilmCardAction | undefined}  action
   */
  function getAction(id) {
    return actions.find((a) => a.id === id);
  }

  /**
   * Move action to new index
   * @param {string} id
   * @param {number} delta
   */
  function moveAction(id, delta) {
    const order = [...config.value.filmCard.actionsOrder];
    const index = order.findIndex((item) => item.id === id);

    if (index === -1)
      return;

    const newIndex = index + delta;

    // Ограничиваем диапазон
    if (newIndex < 0 || newIndex >= order.length)
      return;

    // Удаляем и вставляем
    const [moved] = order.splice(index, 1);

    order.splice(newIndex, 0, moved);

    config.value.filmCard.actionsOrder = order;
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFilmCardStore, import.meta.hot));
}

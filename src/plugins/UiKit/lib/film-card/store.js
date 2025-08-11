/** @import {FilmCardAction} from './Public'; */

import { Icon } from '@icon';
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia';
import { h, reactive, toRef, watch } from 'vue';
import { useUIKitConfigStore } from '../../libConfig';

// @unocss-include

export const useFilmCardStore = defineStore('ui.filmCard', () => {
  const { config } = storeToRefs(useUIKitConfigStore());
  /** @type {FilmCardAction[]} */
  const actions = reactive([
    {
      id: 'follow',
      name: 'В избранное',
      icon: h(Icon, { name: 'line-md-heart-filled' }),
      isAvailable: () => true,
      action: () => null,
    },
    // {
    //   id: 'watchLater',
    //   name: 'Смотреть позже',
    //   icon: 'i-mingcute:time-fill',
    //   action: () => null,
    // },
    // {
    //   id: 'share',
    //   name: 'Поделиться',
    //   icon: 'i-mingcute:share-2-fill',
    //   action: () => null,
    // },
    // {
    //   id: 'addToList',
    //   name: 'Добавить в список',
    //   icon: line-md-list,
    //   action: () => null,
    // },
  ]);
  const actionsOrder = toRef(() => config.value.filmCard.actionsOrder);

  watch(() => config.value.filmCard.actionsOrder.length === 0, () => {
    initDefaultActions();
  });

  return {
    actions,
    actionsOrder,
    addActionBtn,
    removeActionBtn,
  };

  /**
   * @param {FilmCardAction} button
   */
  function addActionBtn(button) {
    if (actions.find((e) => e.name === button.name)) {
      throw new Error(`Button action ${button.name} already added`);
    }
    actions.push(button);
    addToOrder(button);

    return () => removeActionBtn(button);
  }

  /**
   * @param {FilmCardAction} button
   */
  function removeActionBtn(button) {
    const i = actions.findIndex((e) => e.name === button.name);

    if (i !== -1) {
      actions.splice(i, 1);
      return true;
    }
  }

  /**
   * @param {FilmCardAction} button
   */
  function addToOrder(button) {
    if (!config.value.filmCard.actionsOrder.find((item) => item.id === button.id)) {
      config.value.filmCard.actionsOrder.push({ id: button.id });
    }
  }

  function initDefaultActions() {
    actions.forEach((e) => {
      addToOrder(e);
    });
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFilmCardStore, import.meta.hot));
}

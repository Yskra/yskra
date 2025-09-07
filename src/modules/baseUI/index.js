/** @import {App} from 'vue' */
import { h } from 'vue';
/** @import {Module} from '@/modules/Public' */

import { useAppBus } from '@/utils/appBus';

import * as components from './components';
import { DialogsContainer, setCurrentApp, useDialogStore } from './dialogs-helper-api';
import { focusDirective } from './dicrections/focus';
import { focusSectionDirective } from './dicrections/focus-section';
import { NotificationContainer, useNoticesStore } from './notices-api';
import './main.css';

export {
  components,
};

/**
 * @type {Module}
 */
export function createBaseUIModule({ rootComponents }) {
  const bus = useAppBus();

  return {
    displayName: 'BaseUIModule',

    install(app) {
      registerComponents(app);
      registerDirectives(app);
      setCurrentApp(app);
      initNotificationApi();
      initDialogApi();

      // const storeBg = lib.useBackgroundStore();
      // const noticesStore = lib.useNoticesStore();
      // const filmCardStore = lib.useFilmCardStore();
      // const { presentationMode } = storeToRefs(storeBg);

      // bus.addService('ui.background', {
      //   setImage: storeBg.setImage,
      //   presentationMode: { type: 'property', value: presentationMode },
      // });

      // bus.addService('ui.filmCard', {
      //   addActionBtn: filmCardStore.addAction,
      //   removeActionBtn: filmCardStore.removeAction,
      // });
      // bus.addService('ui.property', {
      //   fontSize: { type: 'property', value: fontSize },
      //   rem: { type: 'property', value: rem },
      // });
    },
  };

  /**
   * @param {App} app
   */
  function registerComponents(app) {
    Object.entries(components).forEach(([name, component]) => {
      app.component(name, component);
    });
  }

  /**
   * @param {App} app
   */
  function registerDirectives(app) {
    app.directive('focus-section', focusSectionDirective);
    app.directive('focus', focusDirective);
  }

  function initNotificationApi() {
    const $notifications = document.createElement('div');
    const storeNotices = useNoticesStore();

    $notifications.id = 'notifications';
    document.documentElement.appendChild($notifications);

    rootComponents.add(h(NotificationContainer));

    bus.addService('ui.notices', {
      pushNotification: storeNotices.pushNotification,
      removeNotification: storeNotices.removeNotification,
    });
  }
  function initDialogApi() {
    const storeDialog = useDialogStore();

    rootComponents.add(h(DialogsContainer));

    bus.addService('ui.dialog', {
      confirm: storeDialog.confirm,
      prompt: storeDialog.prompt,
      drawer: storeDialog.drawer,
      modal: storeDialog.modal,
    });
  }
}


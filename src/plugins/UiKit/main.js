/** @import {PluginExecute, PluginContext} from '@/modules/pluginManager/Public'; */
/** @import {App} from 'vue' */

import { UseImage, vOnClickOutside } from '@vueuse/components';
import { storeToRefs } from 'pinia';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUIKitConfigStore } from '@/plugins/UiKit/libConfig.js';
import { useAppBus } from '@/utils/appBus.js';
import Logger from '@/utils/Logger.js';
import * as lib from './lib';
import { createNavigation } from './modules/navigation';

import './styles/main.css';

// noinspection JSUnusedGlobalSymbols
/** @type {PluginExecute} */
export default function plugin({ app, defineBusService, defineConfig }) {
  const logger = new Logger('UI Kit');
  const storeConfig = useUIKitConfigStore();

  const $notifications = document.createElement('div');

  $notifications.id = 'notifications';
  document.documentElement.appendChild($notifications);

  const removeServices = initServices(defineBusService);
  const removeModules = initModules(app);
  const removeComponents = registerComponents(app, logger);
  const removeDirectives = registerDirectives(app, logger);
  const removePlatformClass = addPlatformClass();
  const removeGlobalContainers = initGlobalContainers();
  const removeGlobalPackage = initGlobalPackage();

  storeConfig.init(defineConfig);

  return () => {
    removeServices();
    removeComponents();
    removeDirectives();
    removeModules();
    removeGlobalContainers();
    removePlatformClass();
    removeGlobalPackage();
    document.documentElement.removeChild($notifications);
  };
}

/**
 * @param {PluginContext['defineBusService']} defineBusService
 */
function initServices(defineBusService) {
  const storeDialog = lib.useDialogStore();
  const storeBg = lib.useBackgroundStore();
  const noticesStore = lib.useNoticesStore();
  const filmCardStore = lib.useFilmCardStore();
  const { presentationMode } = storeToRefs(storeBg);

  defineBusService('ui.dialog', {
    confirm: storeDialog.confirm,
    prompt: storeDialog.prompt,
    drawer: storeDialog.drawer,
    modal: storeDialog.modal,
  });
  defineBusService('ui.background', {
    setImage: storeBg.setImage,
    presentationMode: { type: 'property', value: presentationMode },
  });
  defineBusService('ui.notices', {
    pushNotification: noticesStore.pushNotification,
    removeNotification: noticesStore.removeNotification,
  });
  defineBusService('ui.filmCard', {
    addActionBtn: filmCardStore.addAction,
    removeActionBtn: filmCardStore.removeAction,
  });

  return () => null;
}

/**
 * @param {App} app
 */
function initModules(app) {
  const unregisterNavigation = createNavigation(app);

  return () => {
    unregisterNavigation();
  };
}

/**
 * @param {App} app
 * @param {Logger} logger
 */
function registerComponents(app, logger) {
  const { t } = useI18n();
  const components = {
    UseImage,
    BaseBadge: lib.BaseBadge,
    BaseButton: lib.BaseButton,
    BaseCard: lib.BaseCard,
    BaseCheckbox: lib.BaseCheckbox,
    BaseCollapse: lib.BaseCollapse,
    BaseDivider: lib.BaseDivider,
    BaseFilter: lib.BaseFilter,
    BaseFilterItem: lib.BaseFilterItem,
    BaseInput: lib.BaseInput,
    BaseLabel: lib.BaseLabel,
    BaseLink: lib.BaseLink,
    BaseLoading: lib.BaseLoading,
    BaseMenu: lib.BaseMenu,
    BaseMenuItem: lib.BaseMenuItem,
    BasePassword: lib.BasePassword,
    BaseProgress: lib.BaseProgress,
    BaseSelect: lib.BaseSelect,
    BaseSelectItem: lib.BaseSelectItem,
    BaseSkeleton: lib.BaseSkeleton,
    BaseTabs: lib.BaseTabs,
    BaseTabsItem: lib.BaseTabsItem,
    BaseSlider: lib.BaseSlider,
    BaseTable: lib.BaseTable,
    BaseToggle: lib.BaseToggle,
    BaseUsername: lib.BaseUsername,
    BaseTooltip: lib.BaseTooltip,
    YCarousel: lib.YCarousel,
    YConfirm: lib.YConfirm,
    YDialog: lib.YDialog,
    YModal: lib.YModal,
    YDrawer: lib.YDrawer,
    YGrid: lib.YGrid,
    VNotification: lib.VNotification,
    YPrompt: lib.YPrompt,
    YSlider: lib.YSlider,
    // YSortList: lib.YSortList,
    FilmCard: lib.FilmCard,
    AppLink: lib.AppLink,
    Icon: lib.Icon,
    BackgroundImageLayout: lib.BackgroundImageLayout,
    DialogLayout: lib.DialogLayout,
    SidebarLayout: lib.SidebarLayout,
  };

  Object.entries(components).forEach(([name, component]) => {
    app.component(name, component);
  });
  logger.info(t('registeredGlobalComponents', { length: Object.keys(components).length }));

  return () => {
    Object.keys(components).forEach((name) => {
      delete app._context.components[name];
    });
  };
}

/**
 * @param {App} app
 * @param {Logger} logger
 */
function registerDirectives(app, logger) {
  const { t } = useI18n();

  const directives = {
    clickOutside: vOnClickOutside,
  };

  Object.entries(directives).forEach(([name, directive]) => {
    app.directive(name, directive);
  });
  logger.info(t('registeredGlobalDirectives', { length: Object.keys(directives).length }));

  return () => {
    Object.keys(directives).forEach((name) => {
      delete app._context.directives[name];
    });
  };
}

/**
 */
function initGlobalContainers() {
  const bus = useAppBus();

  const rm1 = bus.call('rootComponent:add', h(lib.DialogsContainer));
  const rm2 = bus.call('rootComponent:add', h(lib.NotificationContainer));

  return () => {
    rm1();
    rm2();
  };
}

function addPlatformClass() {
  const platformClass = `platform-${Yskra.platform.isTV ? 'tv' : 'desktop'}`;

  document.documentElement.classList.add(platformClass);

  return () => {
    document.documentElement.classList.remove(platformClass);
  };
}

function initGlobalPackage() {
  // const rm = Yskra.package.add({
  //   name: 'UIKit',
  //   module: lib,
  //   version: manifest.version,
  //   author: manifest.author,
  // });

  return () => {
    // rm();
  };
}

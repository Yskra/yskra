// noinspection JSIgnoredPromiseFromCall,DuplicatedCode

/** @import {VNodeProps, VNode, FunctionalComponent, Component, App} from 'vue' */
/** @import {UseConfirmDialogReturn} from '@vueuse/core' */
/** @import {DialogController} from '@/utils/dialog' */

import { useConfirmDialog } from '@vueuse/core';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { h, isVNode, nextTick, reactive } from 'vue';
import { useDialog } from '@/utils/dialog.js';

/** @type {App} */
let app;

/**
 * @param {App} value
 */
export function setCurrentApp(value) {
  app = value;
}

export const useDialogStore = defineStore('ui.dialog', () => {
  let nextId = 0;
  const renderNodes = reactive(new Set());

  return {
    renderNodes,

    confirm,
    prompt,
    drawer,
    modal,
  };

  /**
   * @param {VNode} node
   * @return {() => void} remove node
   */
  function addNode(node) {
    const id = nextId++;
    const val = { id, node };

    renderNodes.add(val);

    // Need to delete the node so as not to clutter the application,
    // not immediately, so that there is an animation of leaving, if there is one
    return () => setTimeout(() => renderNodes.delete(val), 1000);
  }

  /**
   * @param {string|{text: string, open?: boolean, targetRef?: Element | null}} optsOtText text of the dialog or object with text and open
   * @return {UseConfirmDialogReturn<boolean, string, void>} controller. see: https://vueuse.org/core/useConfirmDialog/#useconfirmdialog
   */
  function confirm(optsOtText) {
    let text;
    let open = true;
    let targetRef;

    if (typeof optsOtText === 'string') {
      text = optsOtText;
    }
    else {
      text = optsOtText.text;
      open = optsOtText.open ?? true;
      targetRef = optsOtText.targetRef;
    }

    const YConfirm = resolveComponent('YConfirm');
    const controller = useConfirmDialog();
    const node = h(YConfirm, { controller, text, targetRef });
    const closed = addNode(node);

    controller.onCancel(closed);
    controller.onConfirm(closed);

    nextTick(() => {
      if (open) {
        controller.reveal();
      }
    });

    return {
      ...controller,
      reveal: async () => {
        await nextTick();
        return controller.reveal();
      },
    };
  }

  /**
   * @param {string|{text: string, placeholder: string, validator: (v: string) => string | undefined | Promise<string | undefined>, open?: boolean, targetRef?: Element | null}} optsOtText text of the dialog or object with text, placeholder, validator and open
   * @param {string} p placeholder of the input
   * @param {(v: string) => string | undefined | Promise<string | undefined>} v validator of the input before confirm
   * @return {UseConfirmDialogReturn<boolean, string, void>} controller. see: https://vueuse.org/core/useConfirmDialog/#useconfirmdialog
   */
  function prompt(optsOtText, p = '', v = () => undefined) {
    let text;
    let open = true;
    let placeholder = p;
    let validator = v;
    let targetRef;

    if (typeof optsOtText === 'string') {
      text = optsOtText;
    }
    else {
      text = optsOtText.text;
      open = optsOtText.open ?? true;
      placeholder = optsOtText.placeholder ?? p;
      validator = optsOtText.validator ?? v;
      targetRef = optsOtText.targetRef;
    }

    const YPrompt = resolveComponent('YPrompt');
    const controller = useConfirmDialog();
    const node = h(YPrompt, { controller, text, placeholder, validator, targetRef });
    const closed = addNode(node);

    controller.onCancel(closed);
    controller.onConfirm(closed);

    nextTick(() => {
      if (open) {
        controller.reveal();
      }
    });

    return {
      ...controller,
      reveal: async () => {
        await nextTick();
        return controller.reveal();
      },
    };
  }

  /**
   * @param {object} opts
   * @param {VNode} opts.body  ex: h('div') or h(() => h('div', {"reactiveProps"}))
   * @param {string|VNode=} opts.title modal title
   * @param {boolean=} opts.open
   * @param {Element=} opts.targetRef
   * @return {DialogController} controller
   */
  function drawer({ body, title, open = true, targetRef }) {
    const YDrawer = resolveComponent('YDrawer');
    const controller = useDialog();
    const titleIsVNode = isVNode(title);
    const node = h(() =>
      h(YDrawer, {
        'show': controller.isOpened.value,
        'onUpdate:show': controller.close,
        'title': titleIsVNode ? undefined : title,
        'targetRef': targetRef,
      }, {
        default: (/** @type {VNodeProps} */ props) => h(body, props),
        title: (/** @type {VNodeProps} */ props) => titleIsVNode ? h(title, props) : undefined,
      }));
    const remove = addNode(node);

    nextTick(() => {
      if (open) {
        controller.reveal();
      }
    });
    controller.onClose(() => {
      remove();
    });

    return {
      ...controller,
      reveal: async () => {
        await nextTick();
        return controller.reveal();
      },
    };
  }

  /**
   * @param {object} opts
   * @param {VNode} opts.body  ex: h('div') or h(() => h('div', {"reactiveProps"}))
   * @param {string|VNode=} opts.title modal title
   * @param {{ is: FunctionalComponent<void>, label: string, onClick: (ctx: { close: () => void, event: Event }) => void, type: DaisyUIType }[]=} opts.buttons
   * @param {VNode=} opts.footer rewrite bottom buttons container
   * @param {boolean=} opts.open
   * @param {Element=} opts.targetRef
   * @return {DialogController} controller
   */
  function modal({ body, title, buttons, footer, open = true, targetRef }) {
    const YModal = resolveComponent('YModal');
    const controller = useDialog();
    const titleIsVNode = isVNode(title);
    const footerIsVNode = isVNode(footer);
    const node = h(() =>
      h(YModal, {
        'show': controller.isOpened.value,
        'onUpdate:show': controller.close,
        'title': titleIsVNode ? undefined : title,
        'targetRef': targetRef,
        buttons,
      }, {
        default: (/** @type {VNodeProps} */ props) => h(body, props),
        title: (/** @type {VNodeProps} */ props) => titleIsVNode ? h(title, props) : undefined,
        footer: (/** @type {VNodeProps} */ props) => footerIsVNode ? h(footer, props) : undefined,
      }));
    const remove = addNode(node);

    nextTick(() => {
      if (open) {
        controller.reveal();
      }
    });
    controller.onClose(() => {
      remove();
    });

    return {
      ...controller,
      reveal: async () => {
        await nextTick();
        return controller.reveal();
      },
    };
  }
});

/**
 * @param {string} name
 * @return {Component}
 */
function resolveComponent(name) {
  return app._context.components[name];
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDialogStore, import.meta.hot));
}

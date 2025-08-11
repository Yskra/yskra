/* eslint-disable jsdoc/valid-types */
/** @import {VNode} from 'vue' */

import { h, isVNode } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * Dynamically resolve component as text block with i18n
 * @param {object} props props
 * @param {undefined|string|VNode} props.is vNode or plain text
 * @param {string=} props.defaultTag span or div
 * @returns {VNode|null} resolved node
 */
export function ResolveTextComponent({ is, defaultTag = 'span' }) {
  const i18n = useI18n();

  if (!is) {
    return null;
  }

  if (isVNode(is)) {
    return is;
  }

  const text = i18n.te(is) ? i18n.t(is) : is;

  return h(defaultTag, text);
}

/**
 * Dynamically resolve component as icon or block with icons class
 * @param {object} props props
 * @param {unknown|VNode} props.is vNode or class icon
 * @param {string=} props.defaultTag span or div
 * @returns {VNode|null} resolved node
 */
export function ResolveIconComponent({ is, defaultTag = 'div' }) {
  if (!is) {
    return null;
  }

  if (isVNode(is)) {
    return is;
  }

  return h(defaultTag, { class: is });
}

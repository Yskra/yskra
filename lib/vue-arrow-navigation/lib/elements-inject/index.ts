import type { InjectionKey } from 'vue';
import { localProvidedStateMap } from './map';

const ATTRIBUTE_NAME = 'data-has-inject';

/**
 * Injection by HTMLElement
 */

interface Logger {
  warn: (...a: any) => void;
}

export function elementInject<T = unknown>(el: Element, key: InjectionKey<T> | string, defaultValue?: T, opts: { logger: Logger } = { logger: window.console }): T | undefined {
  const parent = closedElement(el, `[${ATTRIBUTE_NAME}]`);

  if (parent && localProvidedStateMap.has(parent) && key in localProvidedStateMap.get(parent)!) {
    return localProvidedStateMap.get(parent)![key] as T;
  }

  opts.logger.warn(`injection "${String(key)}" not found.`, el);

  if (defaultValue) {
    return defaultValue;
  }
}

export function elementProvide<T = unknown>(el: Element, key: InjectionKey<T> | string, value?: T) {
  if (!localProvidedStateMap.has(el)) {
    localProvidedStateMap.set(el, Object.create(null));
  }
  const localProvidedState = localProvidedStateMap.get(el)!;

  localProvidedState[key] = value;
  el.setAttribute(ATTRIBUTE_NAME, '');
}

function closedElement(el: Element, selector: string): Element | null {
  const e = el.closest(selector);

  if (e === el && e.parentElement !== null) {
    return e.parentElement.closest(selector);
  }

  return e;
}

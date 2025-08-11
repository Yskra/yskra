const cache = new WeakMap<Element, Element | null>();

/**
 * Finds the first scrollable parent of an element.
 */
export function findScrollContainer(element: Element): Element | null {
  if (!element) {
    return null;
  }

  let parent = element.parentElement;

  while (parent) {
    if (cache.has(parent)) {
      return cache.get(parent)!;
    }

    // prevent scroll on fixed page element like sidebar, drawer, etc
    if (parent.clientHeight === document.documentElement.clientHeight && parent !== document.documentElement) {
      return null;
    }
    if (parent.scrollHeight > parent.clientHeight) {
      cache.set(parent, parent);
      return parent;
    }
    parent = parent.parentElement;
  }

  return document.documentElement;
}

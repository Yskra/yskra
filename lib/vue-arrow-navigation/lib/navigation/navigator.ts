import type {Adapter, Direction, Elements, FocusableElement, NavigationGuards, NavigatorOptions, ResolveElementFrom, ResolveElementTo} from './Public';
import {refAutoReset} from '@vueuse/core';
import {computed, shallowRef, watch} from 'vue';
import {SimpleStack} from '../simple-stack';
import {useElementsUtils} from './elementsCalcs';
import {ChangeFocusCause} from './Public.d';

const FOCUS_HANDLER_ACTIVE_TIMEOUT = 2000;

export function createNavigator(elements: Elements, guards: NavigationGuards, options: NavigatorOptions, adapter: Adapter) {
  const activeElement = adapter.activeNode;
  const activeSection = shallowRef<Element>(adapter.fallbackElement);
  const sectionStack = new SimpleStack<Element>();
  const { filterByDirection, getClosedElements, useRectIterator } = useElementsUtils(adapter);

  // if user not use keyboard arrow keys = disable focus restore
  const isFocusHandlerActive = refAutoReset(!options.passiveRestoreFocus, FOCUS_HANDLER_ACTIVE_TIMEOUT);

  const autofocusSections = computed(() => new Map(Array.from(elements)
    .filter(([,v]) => v.config.autofocus),
  ));

  const getAllSections = (): Element[] => Array.from(elements.keys());
  const getAllFocusableSections = (): Element[] => Array.from(elements.entries())
    .filter(([,v]) => v.children.size > 0)
    .map(([k]) => k);
  const getSectionElements = (): FocusableElement[] => Array.from(elements.get(activeSection.value)?.children.values() ?? []);

  const sectionRects = useRectIterator(getAllFocusableSections);
  const sectionElementsRects = useRectIterator(getSectionElements);

  // auto restore focus
  watch(elements, (focusableElements) => {
    // sync sectionStack with actual focusableElements
    sectionStack.filter((s) => focusableElements.has(s));

    // restore section
    if (!focusableElements.has(activeSection.value)) {
      sectionFocusRestore();
      focusRestore();
    }
    // restore element
    else if (activeElement.value && !focusableElements.get(activeSection.value)?.children.has(activeElement.value)) {
      focusRestore();
    }
  }, { deep: true, immediate: true });
  watch(activeElement, (activeElement) => {
    if ((!activeElement || activeElement === adapter.fallbackElement)) {
      focusRestore();
    }

    // save last focused
    if (activeElement && elements.get(activeSection.value)?.children.has(activeElement)) {
      const { instance } = elements.get(activeSection.value)!;

      instance.defaultFocus = activeElement;
    }
  });
  watch(autofocusSections, (value, oldValue) => {
    const newSection = value.keys().filter((key) => !oldValue.has(key)).next().value;

    if (newSection) {
      focusSection(newSection, {
        cause: ChangeFocusCause.AUTO,
        direction: null,
      });
    }
  });

  isFocusHandlerActive.value = true;

  return {
    focus,
    triggerFocusRestore: () => isFocusHandlerActive.value = true,

    debugData: {
      activeElement,
      activeSection,
      autofocusSections,
      elements,
    },
  };

  function focus(direction: Direction) {
    if (tryFocusNextElement(direction))
      return;
    if (trySelectNextSection(direction)) {
      if (tryFocusDefaultElement() || tryFocusNextElement(direction))
        return;
      focusRestore();
    }
  }

  function tryFocusNextElement(direction: Direction): boolean {
    const target = activeElement.value;

    if (!target) {
      return false;
    }

    const closed = getClosedElements(target, sectionElementsRects, direction);

    for (const item of closed) {
      const success = focusElement(item.target, item.rect, {
        direction,
        cause: ChangeFocusCause.KEYDOWN,
      });

      if (success) {
        return true;
      }
    }
    return false;
  }

  function trySelectNextSection(direction: Direction): boolean {
    const target = (activeElement.value && activeElement.value !== adapter.fallbackElement) ? activeElement.value : activeSection.value;

    if (!target) {
      return false;
    }

    // fixme тут лишние пару раз за вызов этой функции у элементов вызывается getNodeRect() - придумать как передавать rect
    const candidates = filterByDirection(target, sectionRects, direction)
      .filter((e) => e !== activeSection.value);

    const candidatesWithParent: Map<Element, Element> = new Map(Array.from(elements.entries())
      .filter(([k]) => candidates.includes(k))
      .reduce<[Element, Element][]>((acc, [k, v]) => [
        ...acc,
        ...Array.from(v.children).map((e): [Element, Element] => [e, k]),
      ], []),
    );
    const rects = useRectIterator(candidatesWithParent.keys());
    const closed = getClosedElements(target, rects, direction);

    for (const item of closed) {
      const success = focusSection(candidatesWithParent.get(item.target)!, {
        direction,
        cause: ChangeFocusCause.KEYDOWN,
      });

      if (success) {
        return true;
      }
    }
    return false;
  }

  function tryFocusDefaultElement(): boolean {
    const element = getDefaultFocus();

    if (element) {
      return focusElement(element, adapter.getNodeRect(element), {
        cause: ChangeFocusCause.KEYDOWN,
        direction: null,
      });
    }

    return false;
  }

  function sectionFocusRestore() {
    if (sectionStack.size > 0) {
      focusSection(sectionStack.pop()!, {
        cause: ChangeFocusCause.RESTORE,
        direction: null,
      });
    }
    else {
      const sections = getAllSections();

      if (sections.length === 0) {
        return;
      }
      focusSection(sections.at(0)!, {
        cause: ChangeFocusCause.RESTORE,
        direction: null,
      });
    }
  }


  function focusRestore() {
    // 1. Try to restore last focused element current section
    const element = getDefaultFocus();

    if (element) {
      focusElement(element, adapter.getNodeRect(element), {
        cause: ChangeFocusCause.RESTORE,
        direction: null,
      });
      return;
    }

    // 2. Get the first element from the current section
    const elementsPool = getSectionElements();

    if (elementsPool.length > 0) {
      focusElement(elementsPool[0], adapter.getNodeRect(elementsPool[0]), {
        cause: ChangeFocusCause.RESTORE,
        direction: null,
      });
    }
  }

  function getDefaultFocus(): FocusableElement | null {
    if (elements.has(activeSection.value)) {
      const { instance, children } = elements.get(activeSection.value)!;

      if (instance.defaultFocus) {
        if (children.has(instance.defaultFocus)) {
          return instance.defaultFocus
        }
        else {
          instance.defaultFocus = null;
        }
      }
    }

    return null;
  }

  function focusSection(section: Element, meta: { direction: Direction | null; cause: ChangeFocusCause }): boolean {
    const toPayload = { target: section, ...meta };
    const fromPayload = { target: activeSection.value, ...meta };

    if (!guards.resolveBeforeSection(toPayload, fromPayload)) {
      return false;
    }
    if (activeElement.value && elements.get(activeSection.value)?.children.has(activeElement.value)) {
      const { instance } = elements.get(activeSection.value)!;

      instance.defaultFocus = activeElement.value;
    }

    activeSection.value = section;
    sectionStack.push(section);

    guards.resolveAfterSection(toPayload, fromPayload);
    return true;
  }
  function focusElement(element: FocusableElement, rect: DOMRectReadOnly, meta: { direction: Direction | null; cause: ChangeFocusCause }): boolean {
    const toPayload = { target: element, rect, section: activeSection.value, ...meta };
    const fromPayload = { target: activeElement.value, rect, section: activeSection.value, ...meta };

    if (!element || !guards.resolveBeforeElement(toPayload, fromPayload)) {
      return false;
    }

    if (isFocusHandlerActive.value) {
      adapter.focusNode(element, toPayload);
      handleScroll(toPayload, fromPayload);
    }

    guards.resolveAfterElement(toPayload, fromPayload);

    return true;
  }

  function handleScroll(to: ResolveElementTo, from: ResolveElementFrom) {
    options.scrollBehavior(to, from);
  }
}

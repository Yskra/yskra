import type { ComponentHighLighterOptions } from './types';
import { CARD_ELEMENT_ID, cardStyles, COMPONENT_NAME_ELEMENT_ID, CONTAINER_ELEMENT_ID, containerStyles, INDICATOR_ELEMENT_ID, indicatorStyles } from './constants';
import { getElementName } from './elementName';
import { getCardElement, getContainerElement, getIndicatorElement, getNameElement, getStyles } from './utils';

// works with elements, not only with vue components

export function useHighlight() {
  return {
    highlightElement: highlight,
    unhighlightElement: unhighlight,
  };

  function highlight(element: Element) {
    const bounds = element.getBoundingClientRect();

    if (!bounds.width && !bounds.height) {
      return;
    }

    const name = getElementName(element);
    const container = getContainerElement();

    container ? update({ bounds, name }) : create({ bounds, name });
  }

  function unhighlight() {
    const el = getContainerElement();

    if (el)
      el.style.display = 'none';
  }
}

function create(options: ComponentHighLighterOptions & { elementId?: string; style?: Partial<CSSStyleDeclaration> }) {
  const containerEl = document.createElement('div');

  containerEl.id = options.elementId ?? CONTAINER_ELEMENT_ID;
  Object.assign(containerEl.style, {
    ...containerStyles,
    ...getStyles(options.bounds),
    ...options.style,
  });

  const cardEl = document.createElement('span');

  cardEl.id = CARD_ELEMENT_ID;
  Object.assign(cardEl.style, {
    ...cardStyles,
    top: options.bounds.top < 35 ? 0 : '-35px',
  });

  const nameEl = document.createElement('span');

  nameEl.id = COMPONENT_NAME_ELEMENT_ID;
  nameEl.innerHTML = `&lt;${options.name}&gt;&nbsp;&nbsp;`;

  const indicatorEl = document.createElement('i');

  indicatorEl.id = INDICATOR_ELEMENT_ID;
  indicatorEl.innerHTML = `${Math.round(options.bounds.width * 100) / 100} x ${Math.round(options.bounds.height * 100) / 100}`;
  Object.assign(indicatorEl.style, indicatorStyles);

  cardEl.appendChild(nameEl);
  cardEl.appendChild(indicatorEl);
  containerEl.appendChild(cardEl);
  document.body.appendChild(containerEl);
  return containerEl;
}

function update(options: ComponentHighLighterOptions) {
  const containerEl = getContainerElement();
  const cardEl = getCardElement()!;
  const nameEl = getNameElement()!;
  const indicatorEl = getIndicatorElement()!;

  if (containerEl) {
    Object.assign(containerEl.style, {
      ...containerStyles,
      ...getStyles(options.bounds),
    });
    Object.assign(cardEl.style, {
      top: options.bounds.top < 35 ? 0 : '-35px',
    });
    nameEl.innerHTML = `&lt;${options.name}&gt;&nbsp;&nbsp;`;
    indicatorEl.innerHTML = `${Math.round(options.bounds.width * 100) / 100} x ${Math.round(options.bounds.height * 100) / 100}`;
  }
}

// let inspectInstance: VueAppInstance = null!;
// function inspectFn(e: MouseEvent) {
//   const target = e.target as { __vueParentComponent?: VueAppInstance };
//   if (target) {
//     const instance = target.__vueParentComponent;
//     if (instance) {
//       inspectInstance = instance;
//       const el = instance.vnode.el as HTMLElement | undefined;
//       if (el) {
//         const bounds = getComponentBoundingRect(instance);
//         const name = getInstanceName(instance);
//         const container = getContainerElement();
//         container ? update({ bounds, name }) : create({ bounds, name });
//       }
//     }
//   }
// }
//
// function selectComponentFn(e: MouseEvent, cb) {
//   e.preventDefault();
//   e.stopPropagation();
//   if (inspectInstance) {
//     const uniqueComponentId = getUniqueComponentId(inspectInstance);
//     cb(uniqueComponentId);
//   }
// }
// export function toggleComponentHighLighter(options: ComponentHighLighterOptions) {
//   if (options.visible) {
//     const instance = getComponentInstance(activeAppRecord.value!, options.id);
//     if (instance && (options.bounds.width || options.bounds.height)) {
//       const name = getInstanceName(instance);
//       const el = getContainerElement();
//       el ? update({ ...options, name }) : create({ ...options, name });
//     }
//   }
//   else {
//     const el = getContainerElement();
//     if (el)
//       el.style.display = 'none';
//   }
// }
//
// let inspectComponentHighLighterSelectFn: (e: MouseEvent) => void = null!;
//
// export function cancelInspectComponentHighLighter() {
//   unhighlight();
//   window.removeEventListener('mouseover', inspectFn);
//   window.removeEventListener('click', inspectComponentHighLighterSelectFn, true);
//   inspectComponentHighLighterSelectFn = null!;
// }
//
// export function inspectComponentHighLighter() {
//   window.addEventListener('mouseover', inspectFn);
//   return new Promise<string>((resolve) => {
//     function onSelect(e: MouseEvent) {
//       e.preventDefault();
//       e.stopPropagation();
//       selectComponentFn(e, (id: string) => {
//         window.removeEventListener('click', onSelect, true);
//         inspectComponentHighLighterSelectFn = null!;
//         window.removeEventListener('mouseover', inspectFn);
//         const el = getContainerElement();
//         if (el)
//           el.style.display = 'none';
//         resolve(JSON.stringify({ id }));
//       });
//     }
//     inspectComponentHighLighterSelectFn = onSelect;
//     window.addEventListener('click', onSelect, true);
//   });
// }
//
// export function scrollToComponent(options: ScrollToComponentOptions) {
//   const instance = getComponentInstance(activeAppRecord.value!, options.id);
//   if (instance) {
//     const [el] = getRootElementsFromComponentInstance(instance);
//     // @ts-expect-error type mismatch
//     if (typeof el.scrollIntoView === 'function') {
//       // @ts-expect-error type mismatch
//       el.scrollIntoView({
//         behavior: 'smooth',
//       });
//     }
//     else {
//       const bounds = getComponentBoundingRect(instance);
//       const scrollTarget = document.createElement('div');
//       const styles = {
//         ...getStyles(bounds),
//         position: 'absolute',
//       };
//       Object.assign(scrollTarget.style, styles);
//       document.body.appendChild(scrollTarget);
//       scrollTarget.scrollIntoView({
//         behavior: 'smooth',
//       });
//       setTimeout(() => {
//         document.body.removeChild(scrollTarget);
//       }, 2000);
//     }
//
//     setTimeout(() => {
//       const bounds = getComponentBoundingRect(instance);
//       if (bounds.width || bounds.height) {
//         const name = getInstanceName(instance);
//         const el = getContainerElement();
//         el ? update({ ...options, name, bounds }) : create({ ...options, name, bounds });
//         setTimeout(() => {
//           if (el)
//             el.style.display = 'none';
//         }, 1500);
//       }
//     }, 1200);
//   }
// }

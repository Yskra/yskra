import type {Config} from './Public';
import {useActiveElement} from '@vueuse/core';
import {Direction, KeyboardClick} from '../navigation';
import {scrollTo} from '../scroll';


export default {
  adapter: {
    getNodeRect: (element) => element.getBoundingClientRect(),
    // preventScroll - smoother navigation will be used in navigatorOptions.scrollBehavior
    focusNode: (element) => element.focus({ preventScroll: true }),
    activeNode: useActiveElement(),
    fallbackElement: document.body,
  },
  sectionConfig: {
    autofocus: false,
  },
  navigatorOptions: {
    // disabling this enables aggressive focus restore, that can be triggered by clicking the mouse at the
    passiveRestoreFocus: true,
    // called before the adapter.focusNode();
    scrollBehavior: (to) => scrollTo({
      target: to.target,
      rect: to.rect,
      direction: to.direction,
    }),
    // smoother scrolling when key is being held down
    keyboardThrottleTimeout: 300,
  },
  // all allowed keys: https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
  keyboardMap: {
    [Direction.LEFT]: 'ArrowLeft',
    [Direction.RIGHT]: 'ArrowRight',
    [Direction.UP]: 'ArrowUp', // or ['ArrowUp', 'W']
    [Direction.DOWN]: 'ArrowDown',

    // it's acceptable to reassign to falsy if you want to use your own click handler,
    // but it looks bad if passiveRestoreFocus:true + modal + autofocus = focus won't be assigned to the elements on modal
    // call manual focus restoration by useArrowNavigation().triggerFocusRestore()
    [KeyboardClick]: 'Enter',
  },
  logger: {
    warn: (...args) => console.warn('[ArrowNavigation]', ...args),
    error: (...args) => console.error('[ArrowNavigation]', ...args),
  },
} as const satisfies Config;



import type {EventHookOn, FunctionArgs, PromisifyFn} from '@vueuse/core';
import {createEventHook, createFilterWrapper} from '@vueuse/core';
import type {Options, ResolveElementFrom, ResolveElementTo, ResolveSection} from './Public';
import {createNavigationGuards} from '../navigation-guards';
import {setupEventHandlers} from './eventHandler';
import {createNavigator} from './navigator';
import {Direction, KeyboardClick} from './Public.d';
import {throttleFilterWithBurst} from "../event-filter";
import type {MaybeRefOrGetter} from "vue";

export { ChangeFocusCause, Direction, KeyboardClick } from './Public.d';
export type { Adapter, Elements, KeyboardMap, NavigatorOptions, Options, ResolveSection } from './Public.d';

export function createNavigation(options: Options, onUninstall: EventHookOn, devtoolsData: any) {
  const directionEvent = createEventHook<Direction>();
  const { beforeEach: beforeEachSection, afterEach: afterEachSection, resolveBefore: resolveBeforeSection, resolveAfter: resolveAfterSection } = createNavigationGuards<ResolveSection>(options);
  const { beforeEach: beforeEachElement, afterEach: afterEachElement, resolveBefore: resolveBeforeElement, resolveAfter: resolveAfterElement } = createNavigationGuards<ResolveElementTo, ResolveElementFrom>(options);

  const guards = {
    resolveBeforeSection,
    resolveAfterSection,
    resolveBeforeElement,
    resolveAfterElement,
  };

  const { focus, triggerFocusRestore, debugData } = createNavigator(options.elements, guards, options.navigatorOptions, options.adapter);
  const keyboardHandlerThrottled = useThrottleFn(keyboardHandler, options.keyboardThrottleTimeout);
  const removeHandler = setupEventHandlers(options.keyboardMap, keyboardHandlerThrottled);

  Object.assign(devtoolsData, debugData);

  onUninstall(() => {
    removeHandler();
  });

  return {
    onDirection: directionEvent.on,
    triggerFocusRestore,

    beforeEachSection,
    afterEachSection,
    beforeEachElement,
    afterEachElement,
  };

  function keyboardHandler(action: Direction | typeof KeyboardClick, event: KeyboardEvent) {
    triggerFocusRestore();

    if (isDirection(action)) {
      focus(action);
      // noinspection JSIgnoredPromiseFromCall
      directionEvent.trigger(action);
    }
    if (isKeyboardClick(action)) {
      event.preventDefault();
      event.target?.dispatchEvent(new Event('click', { bubbles: true }));
    }
  }
}

function isDirection(d: string): d is Direction {
  return Object.values(Direction).includes(d as Direction);
}

function isKeyboardClick(d: string): d is typeof KeyboardClick {
  return d === KeyboardClick;
}

function useThrottleFn<T extends FunctionArgs>(fn: T, ms: MaybeRefOrGetter<number> = 200): PromisifyFn<T> {
  return createFilterWrapper(throttleFilterWithBurst(ms), fn)
}


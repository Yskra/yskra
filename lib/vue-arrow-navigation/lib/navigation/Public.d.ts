import type {ShallowRef} from 'vue';
import type {StorageValue} from '../store';

export enum Direction {
  LEFT = 'left',
  RIGHT = 'right',
  UP = 'up',
  DOWN = 'down',
}

export const KeyboardClick = 'click';

export enum ChangeFocusCause {
  RESTORE = 'restore',
  KEYDOWN = 'keydown',
  AUTO = 'autofocus',
}

export interface NavigationGuards {
  resolveBeforeSection: (to: ResolveSection, from: ResolveSection) => boolean;
  resolveAfterSection: (to: ResolveSection, from: ResolveSection) => void;
  resolveBeforeElement: (to: ResolveElementTo, from: ResolveElementFrom) => boolean;
  resolveAfterElement: (to: ResolveElementTo, from: ResolveElementFrom) => void;
}

export interface ResolveSection {
  target: Element;
  direction: Direction | null;
  cause: ChangeFocusCause;
}

export interface ResolveElementTo {
  target: FocusableElement;
  rect: DOMRectReadOnly;
  section: Element;
  direction: Direction | null;
  cause: ChangeFocusCause;
}

export interface ResolveElementFrom {
  target: FocusableElement | undefined | null;
  rect: DOMRectReadOnly;
  section: Element;
  direction: Direction | null;
  cause: ChangeFocusCause;
}

export interface Options {
  adapter: Adapter;
  elements: Elements;
  keyboardThrottleTimeout: number;
  navigatorOptions: NavigatorOptions;
  keyboardMap: KeyboardMap;
  logger: {
    warn: (...a: any) => void;
    error: (...a: any) => void;
  };
}

type Falsy = false | 0 | '' | null | undefined;

export interface KeyboardMap {
  [Direction.LEFT]: string | string[] | Falsy;
  [Direction.RIGHT]: string | string[] | Falsy;
  [Direction.UP]: string | string[] | Falsy;
  [Direction.DOWN]: string | string[] | Falsy;
  [KeyboardClick]: string | string[] | Falsy;
}

export interface NavigatorOptions {
  keyboardThrottleTimeout: number;
  passiveRestoreFocus: boolean; // disabling this enables aggressive focus restore that can be triggered by clicking the mouse at the
  scrollBehavior: (to: ResolveElementTo, from: ResolveElementFrom) => void;
}

export type Elements = Map<Element, StorageValue<FocusableElement>>;

export interface Adapter {
  getNodeRect: (element: Element) => DOMRectReadOnly;
  focusNode: (element: FocusableElement, payload: ResolveElementTo) => void;
  activeNode: ShallowRef<FocusableElement | null | undefined>;
  fallbackElement: Element | typeof document.body;
}

export interface FocusableElement extends Element {
  focus: (opts?: FocusOptions) => void;
  blur: () => void;
}

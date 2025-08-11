import type { MaybeRefOrGetter, Readonly } from 'vue';
import type { SectionConfig } from '../config';

export interface StoreInstance {
  storage: Storage;
  getSection: (element: Element, config: MaybeRefOrGetter<SectionConfig>) => StorageValue;

  initFocusSection: (element: Element, config: MaybeRefOrGetter<SectionConfig>) => {
    children: Readonly<Set<HTMLElement>>;
    addChildren: (c: HTMLElement, isDefault?: boolean) => void;
    delChildren: (c: HTMLElement) => void;
  };
  removeFocusSection: (element: Element) => void;
}

export type Storage = Map<Element, StorageValue>;

interface StorageValue<F extends Element = Element> {
  children: Set<F>;
  config: SectionConfig;
  instance: SectionInstance<F>;
}

export interface SectionInstance<F = Element> {
  devtoolsNodeId: string;
  defaultFocus: F | null;
}

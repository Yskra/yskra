// noinspection JSUnusedLocalSymbols

export const FS_KEY = Symbol('arrow navigation focus-selection');

export const FS_DEFAULT_VALUE = {
  children: new Set(),
  addChildren: (c: Element, isDefault?: boolean) => void 0,
  delChildren: (c: Element) => void 0,
};

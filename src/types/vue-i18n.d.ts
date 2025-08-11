// @ts-expect-error disabled
// noinspection TypeScriptCheckImport

import type { ComponentCustomProperties as _c } from 'vue-i18n';


declare module 'vue' {
  export interface ComponentCustomProperties {
    [k: keyof _c]: _c[keyof _c];
  }
}

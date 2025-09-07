// @ts-nocheck

import { defineComponent as vueDefineComponent } from 'npm:vue';
import { register } from './register.js';

function kebab2PascalCase(str) {
  return str.replace(/(^\w|-\w)/g, (match) =>
    match.replace(/-/, '').toUpperCase());
}


// noinspection JSUnusedGlobalSymbols
export function defineComponent(...args) {
  if (!args[0].registerIgnore) {
    const name = kebab2PascalCase(args[0].__name ?? args[0].name);

    if (name && !register.has(name)) {
      register.set(name, args[0]);
    }
  }

  return vueDefineComponent(...args);
}

export * from 'npm:vue';


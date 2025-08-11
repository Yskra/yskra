<script setup lang="ts">
import { DaisyUI } from '.';
/**
 * @docs https://daisyui.com/components/menu/
 * note: Element in Item may have v-focus directive (some Base* already have this directive)
 */

const types = Object.freeze({
  title: 'menu-title', // Styles a <li> as title
  // 'dropdown-toggle': 'menu-dropdown-toggle', // For the toggle to show/hide the menu-dropdown using JS // note: IDK how
});
const modifiers = Object.freeze({
  disabled: 'menu-disabled', // For disabling a <li>
  active: 'menu-active', // For the element inside <li> to look active
  focus: 'menu-focus', // For the element inside <li> to look focused
  // 'dropdown-show': 'menu-dropdown-show', // Shows the menu-dropdown-toggle and menu-dropdown collapsible submenu using JS  // note: IDK how
});
</script>

<template>
  <DaisyUI
    is="li"
    :modifiers="modifiers"
    :types="types"
    disabled-class="menu-disabled"
  >
    <slot />
  </DaisyUI>
</template>

<style>
.menu li:not(.menu-title):not(.disabled) > :not(ul):not(details):not(.menu-title):not(.menu-active):not(:active):not(.btn):focus,
.menu li:not(.menu-title):not(.disabled) > :not(ul):not(details):not(.menu-title):not(.btn):focus  {
  @apply focus-cursor z-1;
}
</style>

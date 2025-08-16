<script setup lang="ts">
import type { ConfigRaw } from '@/modules/Public';
import { UseClipboard } from '@vueuse/components';
import { onKeyStroke, refAutoReset, useFetch } from '@vueuse/core';
import isEqual from 'fast-deep-equal';
import JsonEditorVue from 'json-editor-vue';
import { computed, ref, toRaw, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppBus } from '@/modules/appBus';
import { deepToRaw } from '@/utils/deepToRaw';
import { useTitle } from '@/utils/title';

const config = defineModel<ConfigRaw>('config', { required: true });
const buffer = ref<ConfigRaw>(deepToRaw(config.value));
const isSaved = refAutoReset(false, 1500);
const firstConfig = ref<ConfigRaw>(deepToRaw(config.value));
const { t } = useI18n();
const bus = useAppBus();

// noinspection SpellCheckingInspection
const editorOptions: any = {
  mode: 'text',
  mainMenuBar: false,
  navigationBar: false,
  statusBar: true,
  stringified: false,
};
const rollbackActive = computed(() => isEqual(toRaw(firstConfig.value), toRaw(buffer.value)));

watch(config, () => {
  buffer.value = deepToRaw(config.value);
}, { deep: true });
onKeyStroke('s', (e) => {
  if (navigator.userAgent.includes('Mac') ? e.metaKey : e.ctrlKey) {
    e.preventDefault();
    save();
  }
}, { target: window });

useTitle(() => t('configEditor'));

function save() {
  if (buffer.value) {
    config.value = deepToRaw(buffer.value);
    isSaved.value = true;
  }
}
function download() {
  const { onConfirm } = bus.call('ui.dialog:confirm', t('doDownloadConfig'));

  onConfirm(async () => {
    const { data, error } = await useFetch('/config.json').get().json();

    if (error.value) {
      bus.emit('ui.notices:pushNotification', {
        contentTitle: t('error'),
        contentText: error.value,
        icon: 'error',
      });
    }
    else {
      buffer.value = data.value;
    }
  });
}

function rollback() {
  buffer.value = toRaw(firstConfig.value);
}

function stringify() {
  return JSON.stringify(buffer.value, null, 2);
}
</script>

<template>
  <div class="h-screen flex flex-col">
    <div class="sticky w-full flex flex-col p-3">
      <div>
        <h2 class="text-xl font-bold">
          {{ $t('configEditor') }}
        </h2>
        <p class="text-sm op-50">
          {{ $t('configEditorDescription') }}
        </p>
      </div>
      <div v-focus-section class="mt-3 flex justify-between">
        <div>
          <BaseButton
            color="primary"
            class="w-65"
            @click="save"
          >
            <div v-if="isSaved" class="i-mingcute:checkbox-fill h-2rem w-2rem" />
            <div v-else class="i-mingcute:save-2-fill h-2rem w-2rem" />
            {{ isSaved ? $t('savedConfig') : $t('saveConfig') }}
          </BaseButton>
        </div>
        <div class="flex">
          <BaseButton
            :disabled="rollbackActive"
            @click="rollback"
          >
            <div class="i-mingcute:refresh-anticlockwise-1-fill h-2rem w-2rem" />
            {{ $t('rollbackConfig') }}
          </BaseButton>
          <BaseButton
            class="mx-2"
            @click="download"
          >
            <div class="i-mingcute:file-download-fill h-2rem w-2rem" />
            {{ $t('downloadConfig') }}
          </BaseButton>

          <UseClipboard v-slot="{ copy, copied }" :source="stringify()">
            <BaseTooltip :data-tip="copied ? $t('copied') : $t('copy')">
              <BaseButton @click="copy()">
                <div v-if="copied" class="i-mingcute:checkbox-fill h-2rem w-2rem color-success" />
                <div v-else class="i-mingcute:copy-fill h-2rem w-2rem" />
              </BaseButton>
            </BaseTooltip>
          </UseClipboard>
        </div>
      </div>
    </div>
    <JsonEditorVue
      v-model="buffer"
      class="jse-themed mt-1 h-0 flex-grow"
      v-bind="editorOptions"
    />
  </div>
</template>

<style scoped>
.jse-themed {
  --jse-theme: dark;

  /* over all fonts, sizes, and colors */
  --jse-theme-color: #2f6dd0;
  --jse-theme-color-highlight: #467cd2;
  --jse-background-color: var(--color-base-300);
  --jse-text-color: var(--color-neutral-content);
  --jse-text-color-inverse: #4d4d4d;

  /* main, menu, modal */
  --jse-main-border: 1px solid transparent;
  /*--jse-menu-color: #fff;*/
  /*--jse-modal-background: #2f2f2f;*/
  /*--jse-modal-overlay-background: rgba(0, 0, 0, 0.5);*/
  /*--jse-modal-code-background: #2f2f2f;*/

  /* tooltip in text mode */
  /*--jse-tooltip-color: var(--jse-text-color);*/
  /*--jse-tooltip-background: #4b4b4b;*/
  /*--jse-tooltip-border: 1px solid #737373;*/
  /*--jse-tooltip-action-button-color: inherit;*/
  /*--jse-tooltip-action-button-background: #737373;*/

  /* panels: navigation bar, gutter, search box */
  --jse-panel-background: var(--color-base-200);
  /*--jse-panel-background-border: 1px solid #464646;*/
  --jse-panel-color: var(--jse-text-color);
  --jse-panel-color-readonly: #737373;
  --jse-panel-border: 1px solid var(--color-neutral);
  /*--jse-panel-button-color-highlight: #e5e5e5;*/
  /*--jse-panel-button-background-highlight: #464646;*/

  /* navigation-bar */
  /*--jse-navigation-bar-background: #656565;*/
  /*--jse-navigation-bar-background-highlight: #7e7e7e;*/
  /*--jse-navigation-bar-dropdown-color: var(--jse-text-color);*/

  /* context menu */
  /*--jse-context-menu-background: #4b4b4b;*/
  /*--jse-context-menu-background-highlight: #595959;*/
  /*--jse-context-menu-separator-color: #595959;*/
  /*--jse-context-menu-color: var(--jse-text-color);*/
  /*--jse-context-menu-pointer-background: #737373;*/
  /*--jse-context-menu-pointer-background-highlight: #818181;*/
  /*--jse-context-menu-pointer-color: var(--jse-context-menu-color);*/

  /* contents: json key and values */
  --jse-key-color: #9cdcfe;
  --jse-value-color: var(--jse-text-color);
  --jse-value-color-number: #b5cea8;
  --jse-value-color-boolean: #569cd6;
  --jse-value-color-null: #569cd6;
  --jse-value-color-string: #ce9178;
  --jse-value-color-url: #ce9178;
  --jse-delimiter-color: #949494;
  --jse-edit-outline: 2px solid var(--jse-text-color);

  /* contents: selected or hovered */
  --jse-selection-background-color: #464646;
  --jse-selection-background-inactive-color: #333333;
  --jse-hover-background-color: #343434;
  --jse-active-line-background-color: rgba(255, 255, 255, 0.06);
  --jse-search-match-background-color: #343434;

  /* contents: section of collapsed items in an array */
  /*--jse-collapsed-items-background-color: #333333;*/
  /*--jse-collapsed-items-selected-background-color: #565656;*/
  /*--jse-collapsed-items-link-color: #b2b2b2;*/
  /*--jse-collapsed-items-link-color-highlight: #ec8477;*/

  /* contents: highlighting of search results */
  --jse-search-match-color: #724c27;
  --jse-search-match-outline: 1px solid #966535;
  --jse-search-match-active-color: #9f6c39;
  --jse-search-match-active-outline: 1px solid #bb7f43;

  /* contents: inline tags inside the JSON document */
  /*--jse-tag-background: #444444;*/
  /*--jse-tag-color: #bdbdbd;*/

  /* contents: table */
  /*--jse-table-header-background: #333333;*/
  /*--jse-table-header-background-highlight: #424242;*/
  /*--jse-table-row-odd-background: rgba(255, 255, 255, 0.1);*/

  /* controls in modals: inputs, buttons, and `a` */
  /*--jse-input-background: #3d3d3d;*/
  /*--jse-input-border: var(--jse-main-border);*/
  /*--jse-button-background: #808080;*/
  /*--jse-button-background-highlight: #7a7a7a;*/
  /*--jse-button-color: #e0e0e0;*/
  /*--jse-button-secondary-background: #494949;*/
  /*--jse-button-secondary-background-highlight: #5d5d5d;*/
  /*--jse-button-secondary-background-disabled: #9d9d9d;*/
  /*--jse-button-secondary-color: var(--jse-text-color);*/
  /*--jse-a-color: red;*/
  /*--jse-a-color-highlight: #4387c9;*/

  /* svelte-select */
  /*--jse-svelte-select-background: #3d3d3d;*/
  /*--jse-svelte-select-border: 1px solid #4f4f4f;*/
  /*--list-background: #3d3d3d;*/
  /*--item-hover-bg: #505050;*/
  /*--multi-item-bg: #5b5b5b;*/
  /*--input-color: #d4d4d4;*/
  /*--multi-clear-bg: #8a8a8a;*/
  /*--multi-item-clear-icon-color: #d4d4d4;*/
  /*--multi-item-outline: 1px solid #696969;*/
  /*--list-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.4);*/

  /* color picker */
  --jse-color-picker-background: #656565;
  --jse-color-picker-border-box-shadow: #8c8c8c 0 0 0 1px;
}
</style>

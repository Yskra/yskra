<script setup lang="ts">
import type { SetupContext } from 'vue';
import enUS from '@locales/fatalError/en-US.json';
import ruRU from '@locales/fatalError/ru-RU.json';
import { onKeyStroke } from '@vueuse/core';
import { h } from 'vue';

const props = defineProps<{
  errors: Set<Error>;
  isFatal: boolean;
}>();
const emit = defineEmits<{
  (e: 'close'): void;
}>();

// noinspection RegExpRedundantEscape
const PLACEHOLDER_REGEX = /\{(\w+)\}/g;

const locales = {
  'ru-RU': ruRU,
  'ru': ruRU,
  'en-US': enUS,
  'en': enUS,
};

const isConfigPage = window.location.hash !== '' ? window.location.hash.endsWith('/config') : window.location.pathname === '/config';
const configPage = `${window.location.origin}${window.location.hash !== '' ? '#' : ''}/config`;
const t = locales[window.navigator.language as keyof typeof locales] ?? locales.en;

onKeyStroke(['Escape', 'ArrowDown'], () => {
  if (!props.isFatal) {
    emit('close');
  }
});

function I18n({ str }: { str: string }, ctx: SetupContext) {
  return h('span', null, replacePlaceholders(str, ctx.slots));
}

function replacePlaceholders(str: string, replacements: Record<string, any>) {
  return str.split(PLACEHOLDER_REGEX).reduce((acc: any[], part, index) => {
    if (index % 2 === 0) {
      acc.push(part);
    }
    else {
      acc.push(h(replacements[part]));
    }
    return acc;
  }, []);
}
</script>

<template>
  <div v-if="props.errors.size" class="fatal-error">
    <div class="dialog">
      <h2 class="title">
        {{ props.isFatal ? t.titleFatal : t.titleRuntime }}
      </h2>
      <div class="error-list">
        <div v-for="error in props.errors" :key="error.message">
          <p class="error-message">
            {{ error.message }}
          </p>
          <pre class="error-stack">
        {{ error.stack }}
      </pre>
        </div>
      </div>
      <div class="user-note">
        <p v-if="!isConfigPage && props.isFatal">
          <I18n :str="t.runConfigEditor">
            <template #editor>
              <b>{{ t.configEditor }}</b>
            </template>
            <template #link>
              <a
                href="/config"
                target="_blank"
                class="config-link"
              >
                {{ configPage }}
              </a>
            </template>
          </I18n>
        </p>

        <p>
          {{ t.writeToChat }}
        </p>

        <div v-if="!props.isFatal">
          <p>
            {{ t.runtimeErrorNote }}
          </p>
          <I18n :str="t.closeModal">
            <template #action>
              <div class="action-keys">
                <kbd class="kbd kbd-md">Esc</kbd>
                <span>{{ t.or }}</span>
                <kbd class="kbd">▼</kbd>
              </div>
            </template>
          </I18n>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* convert unocss styles into static styles so that after compiling this component is maximally independent
from external dependencies that can potentially load with errors */

.fatal-error {
  @apply fixed left-0 top-0 m-0 h-full w-full overflow-y-scroll bg-#0006;
  background: rgb(20, 21, 31);
}
.dialog {
  @apply relative mx-auto my-30 box-border max-w-80vw overflow-hidden border-t-8 border-[#FF637DFF] rounded-md bg-#181818 px-4vw py-2.5vh text-#d9d9d9;
  background: rgb(24, 24, 24);
  border-color: rgb(255, 99, 125);
  color: rgb(217, 217, 217)
}
.title {
  @apply mb-4 text-xl text-error font-bold;
}
.error-list {
  @apply overflow-y-scroll max-h-200;
}
.error-message {
  @apply mb-3;
}
.error-stack {
  @apply my-2 w-full rounded bg-[#101010ff] p-2 text-sm;
  background: rgb(16, 16, 16);
}
.user-note {
  @apply border-t-1 border-#999 border-dotted py-2 line-height-relaxed;
  border-color: rgb(153, 153, 153);
}
.config-link {
  @apply cursor-pointer underline;
}
.action-keys {
  @apply inline;
}
.action-keys span {
  @apply mx-1;
}
</style>

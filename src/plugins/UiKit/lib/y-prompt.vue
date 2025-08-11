<script setup lang="ts">
import type { UseConfirmDialogReturn } from '@vueuse/core';
import { computed, ref } from 'vue';
import { YDialog } from '.';

export interface Props {
  text: string;
  placeholder?: string;
  validator?: (v: string) => string | Promise<string | undefined> | undefined;
  controller: UseConfirmDialogReturn<boolean, string, void>;
}


const { validator = () => Promise.resolve(''), controller } = defineProps<Props>();

const input = ref('');
const inputTrim = computed(() => input.value.trim());
const error = ref();
const waitValidation = ref(false);

function handleEnter(event: KeyboardEvent) {
  if (controller.isRevealed.value && event.target?.dataset?.isCansel !== 'true') {
    confirm();
  }
}

async function confirm() {
  if (controller.isRevealed.value) {
    waitValidation.value = true;
    error.value = await validator(inputTrim.value);

    waitValidation.value = false;

    if (!error.value) {
      controller.confirm(inputTrim.value.trim());
    }
  }
}
</script>

<template>
  <YDialog :show="controller.isRevealed.value" @update:show="() => controller.cancel()">
    <div class="y-prompt" @keydown.enter="handleEnter">
      <h2 class="mb-5 text-base">
        {{ $props.text }}
      </h2>
      <h2 class="h-3 text-base text-error" :class="{ 'shake-horizontal': error }">
        <span>{{ error }}</span>
      </h2>
      <BaseInput
        v-model="input"
        :color="`${error ? 'error' : ''}`"
        class="w-full"
        :placeholder="$props.placeholder"
        @input="error = null"
      />
      <div class="flex justify-end">
        <BaseButton
          class="mx-3 min-w-20"
          :data-is-cansel="true"
          :disabled="waitValidation"
          @click="controller.cancel"
        >
          {{ $t('cancel') }}
        </BaseButton>
        <BaseButton
          color="primary"
          :disabled="waitValidation"
          class="mx-1 min-w-20"
          @click="confirm"
        >
          {{ $t('ok') }}
        </BaseButton>
      </div>
    </div>
  </YDialog>
</template>

<style scoped>
.y-prompt {
  @apply h-45 w-150 flex flex-col justify-between;
}
</style>

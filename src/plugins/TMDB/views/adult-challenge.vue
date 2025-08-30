<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'pass', password: string): void;
}>();

const password = ref('');
const disabled = ref(false);

function pass() {
  disabled.value = true;
  emit('pass', password.value);

  setTimeout(() => {
    disabled.value = false;
    password.value = '';
  }, 1000);
}
</script>

<template>
  <div class="mt-30 w-full flex flex-col items-center justify-center rounded-box">
    <div v-focus-section class="w-200 bg-base-200 p-10">
      <div class="mb-10 flex items-center justify-between">
        <div class="i-mingcute:eye-2-fill h-20 w-20 text-warning" />

        <div class="w-full">
          <p class="text-center text-xl">
            {{ $t('parentalControl') }}
          </p>
        </div>
      </div>
      <div class="flex items-center justify-center">
        <BasePassword
          v-model="password"
          class="mx-5 w-full"
          :disabled="disabled"
          @keyup.enter="pass"
        />
        <BaseButton
          color="primary"
          :disabled="disabled"
          @click="pass"
        >
          {{ $t('ok') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

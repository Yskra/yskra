<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import validUrl from '@/utils/validUrl';

const filed = defineModel({ type: String, required: true });
const error = defineModel('error');
const bufferValue = ref('');
const { t } = useI18n();

watch(filed, () => {
  bufferValue.value = filed.value;
}, { immediate: true });

function onConfirm(str: string) {
  str = str.trim();

  if (!str) {
    error.value = t('notBeEmpty');
    return;
  }
  if (!validUrl(str)) {
    error.value = t('invalidLink');
    return;
  }
  filed.value = str;
}
</script>

<template>
  <BaseInput
    :value="bufferValue"
    class="w-full"
    placeholder="https://example.com"
    @input="error = null; bufferValue = $event.target.value"
    @change="onConfirm($event.target.value)"
  />
</template>

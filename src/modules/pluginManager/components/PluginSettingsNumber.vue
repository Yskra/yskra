<script setup lang="ts">
import { defineComponent, h, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const filed = defineModel({ type: Number, required: true });
const error = defineModel('error');
const bufferValue = ref(0);
const { t } = useI18n();

watch(filed, () => {
  bufferValue.value = filed.value;
}, { immediate: true });

function onConfirm(str: string) {
  const num = Number.parseInt(str.trim(), 10);

  if (Number.isNaN(num)) {
    error.value = t('notNumber');
    return;
  }
  filed.value = num;
}

const InputNumber = defineComponent((_, ctx) => {
  return () => h('input', {
    type: 'number',
    onInput: (event: { target: HTMLInputElement }) => ctx.emit('update:modelValue', event.target.value),
  });
}, {
  emits: ['update:modelValue'],
});
</script>

<template>
  <BaseInput
    :is="InputNumber"
    :value="bufferValue"
    class="w-50"
    @input="error = null; bufferValue = $event.target.value"
    @change="onConfirm($event.target.value)"
  />
</template>

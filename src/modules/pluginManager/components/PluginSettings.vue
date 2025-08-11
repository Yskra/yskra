<script setup lang="ts">
import type { Ref } from 'vue';
import type { RegisterSettingsField } from '@/modules/pluginManager/Public';
import { refAutoReset } from '@vueuse/core';
import { onDeactivated, watch } from 'vue';
import PluginSettingsField from '@/modules/pluginManager/components/PluginSettingsField.vue';

const props = defineProps<{
  fields: Ref<RegisterSettingsField[]>;
}>();
const showSave = refAutoReset(false, 2000);

onDeactivated(() => {
  showSave.value = false;
});

watch(() => props.fields, (value, oldValue) => {
  if (value.value.some((e, i) => oldValue.value[i] !== e)) {
    return;
  }
  showSave.value = true;
}, { deep: true });
</script>

<template>
  <div class="flex flex-col">
    <div class="h-2rem">
      <Transition mode="out-in">
        <div v-if="showSave" class="flex items-center text-sm text-success">
          <div class="i-mingcute:check-2-fill mr-2 h-1rem w-1rem" />
          <span>{{ $t('saved') }}</span>
        </div>
      </Transition>
    </div>
    <PluginSettingsField
      v-for="field in $props.fields.value"
      :key="field.name.toString()"
      :field="field"
    />
  </div>
</template>

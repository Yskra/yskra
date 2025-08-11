<script setup lang="ts">
import type { RegisterSettingsField } from '@/modules/pluginManager/Public';
import { ref } from 'vue';
import PluginSettingsNumber from '@/modules/pluginManager/components/PluginSettingsNumber.vue';
import PluginSettingsURL from '@/modules/pluginManager/components/PluginSettingsURL.vue';
import { ResolveTextComponent } from '@/utils/ResolveComponent';

defineProps<{
  field: RegisterSettingsField;
}>();


const error = ref();
</script>

<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="mb-3">
    <div>
      <h2 class="text-base line-height-loose">
        <ResolveTextComponent :is="field.name" />
      </h2>
      <h2 class="text-xs op-80">
        <ResolveTextComponent :is="field.note" />
      </h2>
    </div>

    <h2 class="h-7 text-sm text-error" :class="{ 'shake-horizontal': error }">
      <span>{{ error }}</span>
    </h2>

    <template v-if="field.type === 'text'">
      <BaseInput
        :value="field.ref"
        class="w-full"
        @input="field.ref = $event.target.value"
      />
    </template>
    <template v-if="field.type === 'url'">
      <PluginSettingsURL
        v-model:model-value="field.ref"
        v-model:error="error"
      />
    </template>
    <template v-if="field.type === 'number'">
      <PluginSettingsNumber
        v-model:model-value="field.ref"
        v-model:error="error"
      />
    </template>
    <template v-if="field.type === 'boolean'">
      <BaseToggle
        v-model:value="field.ref"
      />
    </template>
    <template v-if="field.type === 'select'">
      <BaseSelect
        :title="$t('select')"
        @change="field.ref = $event"
      >
        <BaseSelectItem
          v-for="option in field.options"
          :key="option.value"
          :value="option.value"
          :selected="field.ref === option.value"
        >
          <ResolveTextComponent :is="option.name" />
        </BaseSelectItem>
      </BaseSelect>
    </template>
    <template v-if="typeof field.type === 'function'">
      <component :is="field.type" />
    </template>
  </div>
</template>

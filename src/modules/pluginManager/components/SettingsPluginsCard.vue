<script setup lang="ts">
import type { PluginManifest } from '@/modules/pluginManager/Public';
import { UseImage } from '@vueuse/components';
import { computed } from 'vue';
import { PLUGIN_STATUS, usePluginManager } from '@/modules/pluginManager';
import { Plugin } from '@/modules/pluginManager/Plugin';

const props = defineProps<{
  plugin: PluginManifest;
}>();

const { pluginStatus } = usePluginManager();
const status = computed(() => pluginStatus(props.plugin.id));
</script>

<template>
  <BaseButton
    class="h-100% p-0"
    :class="{ 'op-60 border-base-300': status !== PLUGIN_STATUS.OK }"
  >
    <BaseCard
      class="relative h-60 w-70"
      size="sm"
    >
      <template #figure>
        <figure class="h-40">
          <UseImage
            :src="props.plugin.imageUrl || ''"
            alt=""
            class="max-h-25 max-w-50"
          >
            <template #error>
              <Icon name="line-md-image-twotone" class="h-5em w-5em" />
            </template>
          </UseImage>
        </figure>
      </template>
      <template #title>
        <h1>{{ props.plugin.name }}</h1>
      </template>
      <p class="text-start text-xs op-80">
        {{ Plugin.getLocalizedField('overview', props.plugin) }}
      </p>
      <p class="absolute left-50% top-50% w-full bg-neutral text-2xl line-height-loose text-shadow-xl -translate-1/2">
        <span v-if="status === PLUGIN_STATUS.DISABLED" class="text-error">{{ $t ('disabled') }}</span>
        <span v-if="status === PLUGIN_STATUS.DEPENDENCIES" class="text-warning">{{ $t('dependencies') }}</span>
        <span v-if="status === PLUGIN_STATUS.ERROR" class="text-error">{{ $t('error') }}</span>
        <span v-if="status === PLUGIN_STATUS.MOUNTING" class="color-primary">{{ $t('mounting') }}</span>
      </p>
    </BaseCard>
  </BaseButton>
</template>

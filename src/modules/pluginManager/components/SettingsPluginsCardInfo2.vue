<script setup lang="ts">
import type { PluginInfo } from '@/modules/pluginManager/Public';
import type SourceError from '@/modules/pluginManager/utils/SourceError';

const props = defineProps<{
  error: SourceError;
  pluginInfo: Partial<PluginInfo>;
}>();
</script>

<template>
  <BaseMenu class="w-full p-0">
    <BaseMenuItem v-if="pluginInfo.canRemove" type="title">
      <p>{{ $t('actions') }}</p>
    </BaseMenuItem>
    <BaseMenuItem v-if="pluginInfo.canRemove">
      <div v-focus @click="pluginInfo.remove">
        <div class="i-mingcute:delete-2-fill h-2rem w-2rem" />
        <span>{{ $t('remove') }}</span>
      </div>
    </BaseMenuItem>

    <BaseMenuItem type="title">
      <p>{{ $t('url') }}</p>
    </BaseMenuItem>

    <BaseMenuItem>
      <p>{{ props.error.source.href }}</p>
    </BaseMenuItem>

    <BaseMenuItem type="title">
      <p>{{ $t('error') }}</p>
    </BaseMenuItem>
    <BaseMenuItem>
      <div class="text-md max-w-200 bg-base-300 p-5 text-error font-bold rounded-box">
        <span>
          {{ $t(props.error.template, props.error.payload) }}
        </span>
      </div>
    </BaseMenuItem>
    <pre class="mt-5 max-w-200 overflow-auto bg-base-300 p-5 text-sm rounded-box">
      {{ props.error.stack }}
    </pre>
  </BaseMenu>
</template>

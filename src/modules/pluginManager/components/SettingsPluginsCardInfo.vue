<script setup lang="ts">
import type { PluginInfo } from '@/modules/pluginManager/Public';
import { computed } from 'vue';
import { pluginRuntime as currentRuntime, PLUGIN_RUNTIME, PLUGIN_STATUS } from '@/modules/pluginManager';

const props = defineProps<{
  pluginInfo: PluginInfo;
}>();

const pluginRuntime = computed(() => props.pluginInfo.runtime ?? PLUGIN_RUNTIME.ES);
const incompatibleRuntime = computed(() => pluginRuntime.value !== currentRuntime);
</script>

<template>
  <BaseMenu class="w-full p-0">
    <BaseMenuItem type="title">
      <p>{{ $t('actions') }}</p>
    </BaseMenuItem>
    <BaseMenuItem v-if="incompatibleRuntime">
      <div>
        <div class="bg-warning p-5 text-accent-content rounded-box">
          <p class="text-lg font-bold">
            {{ $t('incompatibleRuntime') }}
          </p>
          <p class="max-w-180 text-sm">
            {{ $t('incompatibleRuntimeNote', { target: pluginRuntime, current: currentRuntime }) }}
          </p>
        </div>
      </div>
    </BaseMenuItem>
    <BaseMenuItem v-if="!props.pluginInfo.isInstalled" :disabled="incompatibleRuntime">
      <div v-focus @click="props.pluginInfo.install">
        <Icon name="line-md-download-outline" class="h-2rem w-2rem" />
        <span>{{ $t('install') }}</span>
      </div>
    </BaseMenuItem>
    <BaseMenuItem
      v-if="props.pluginInfo.isInstalled"
      :disabled="!props.pluginInfo.canRemove"
    >
      <div v-focus="props.pluginInfo.canRemove" @click="props.pluginInfo.remove">
        <div class="i-mingcute:delete-2-fill h-2rem w-2rem" />
        <span>{{ $t('remove') }}</span>
      </div>
    </BaseMenuItem>
    <BaseMenuItem
      v-if="props.pluginInfo.isInstalled && props.pluginInfo.status === PLUGIN_STATUS.DISABLED"
    >
      <div v-focus @click="props.pluginInfo.enable">
        <Icon name="line-md-cog-filled" class="h-2rem w-2rem" />
        <span>{{ $t('enable') }}</span>
      </div>
    </BaseMenuItem>
    <BaseMenuItem
      v-if="props.pluginInfo.isInstalled && props.pluginInfo.status !== PLUGIN_STATUS.DISABLED"
      :disabled="!props.pluginInfo.canDisable"
    >
      <div v-focus="props.pluginInfo.canDisable" @click="props.pluginInfo.disable">
        <Icon name="line-md-cog-off-filled" class="h-2rem w-2rem" />
        <span>{{ $t('disable') }}</span>
      </div>
    </BaseMenuItem>
    <BaseMenuItem type="title" class="mt-5">
      <p>{{ $t('information') }}</p>
    </BaseMenuItem>
    <BaseMenuItem disabled>
      <div>
        <Icon name="line-md-person-filled" class="h-2rem w-2rem" />
        <span>{{ $t('author') }}</span>
        <span>{{ props.pluginInfo.author }}</span>
      </div>
    </BaseMenuItem>
    <BaseMenuItem disabled>
      <div class="pb-1">
        <Icon name="line-md-text-box-multiple" class="h-2rem w-2rem" />
        <span>{{ $t('description') }}</span>
      </div>
      <div class="flex flex-col items-end pt-0 text-base-content line-height-tight">
        <span class="max-w-150 text-end">{{ props.pluginInfo.description }}</span>
      </div>
    </BaseMenuItem>
    <BaseMenuItem
      v-if="props.pluginInfo.status === PLUGIN_STATUS.ERROR"
      disabled
      class="border-2 border-error rounded-box"
    >
      <div>
        <Icon name="line-md-clipboard" class="h-2rem w-2rem" />
        <span>{{ $t('moduleLoadError') }}</span>
        <span>{{ $t('seeLogs') }}</span>
      </div>
    </BaseMenuItem>
    <BaseMenuItem
      v-if="props.pluginInfo.formatDependencies"
      disabled
      class="border-warning rounded-box"
      :class="{ 'border-2': props.pluginInfo.status === PLUGIN_STATUS.DEPENDENCIES }"
    >
      <div>
        <Icon name="line-md-clipboard" class="h-2rem w-2rem" />
        <span>{{ $t('dependsOn') }}</span>
        <span>{{ props.pluginInfo.formatDependencies }}</span>
      </div>
    </BaseMenuItem>
    <BaseMenuItem disabled>
      <div>
        <Icon name="line-md-clipboard" class="h-2rem w-2rem" />
        <span>{{ $t('version') }}</span>
        <span>{{ props.pluginInfo.version }}</span>
      </div>
    </BaseMenuItem>
    <BaseMenuItem>
      <a target="_blank" :href="props.pluginInfo.homepageUrl">
        <Icon name="line-md-home-simple-filled" class="h-2rem w-2rem" />
        <span>{{ $t('homePage') }}</span>
        <Icon name="line-md-external-link" />
      </a>
    </BaseMenuItem>
    <BaseMenuItem>
      <a target="_blank" :href="props.pluginInfo.supportUrl">
        <Icon name="line-md-chat-bubble-filled" class="h-2rem w-2rem" />
        <span>{{ $t('feedback') }}</span>
        <Icon name="line-md-external-link" />
      </a>
    </BaseMenuItem>
    <BaseMenuItem disabled>
      <div>
        <Icon name="line-md-check-all" class="h-2rem w-2rem" />
        <span>{{ $t('id') }}</span>
        <span>{{ props.pluginInfo.id }}</span>
      </div>
    </BaseMenuItem>
  </BaseMenu>
</template>

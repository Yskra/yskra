<script setup>
import STATUS from '@/plugins/TMDBProxy/status.js';

defineProps({
  status: { type: Number },
});
</script>

<template>
  <div>
    <h2 class="text-base font-bold line-height-loose">
      {{ $t('status') }}
    </h2>

    <div class="flex items-center">
      <template v-if="$props.status === STATUS.INIT">
        <div class="mr-2">
          <div class="i-mingcute:server-fill icon-size" />
        </div>
        <span class="text-sm">{{ $t('testConnect') }}...</span>
      </template>
      <template v-if="$props.status === STATUS.DIRECT">
        <div class="mr-2 text-success">
          <div class="i-mingcute:wifi-fill icon-size" />
        </div>
        <span class="text-sm">{{ $t('connectedDirectly') }}</span>
      </template>
      <template v-if="$props.status === STATUS.PROXY">
        <div class="mr-2 text-success">
          <div class="i-mingcute:home-wifi-fill icon-size" />
        </div>
        <span class="text-sm">{{ $t('connectedViaProxy') }}</span>
      </template>
      <template v-if="$props.status === STATUS.PROXY_DEAD">
        <div class="mr-2 text-error">
          <div class="i-mingcute:wifi-off-fill icon-size" />
        </div>
        <span class="text-sm">{{ $t('proxyUnreachable') }}</span>
      </template>
    </div>
  </div>
</template>

<style>
.icon-size {
  @apply w-2rem h-2rem
}
</style>

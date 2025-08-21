<script setup lang="ts">
import { h, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import STATUS from '@/plugins/TMDBProxy/status.js';
import AcceptTOS from '@/plugins/TMDBProxy/ui/AcceptTOS.vue';
import { useAppBus } from '@/utils/appBus';

defineProps<{
  status: typeof STATUS[keyof typeof STATUS];
  forceProxy: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggleForceProxy'): void;
  (e: 'tosAccepted'): void;
}>();
const { t } = useI18n();
const bus = useAppBus();

function showTos() {
  const accepted = shallowRef(false);
  const dialog = bus.call('ui.dialog:modal', {
    title: t('warning'),
    body: h(AcceptTOS, {
      onAccepted: (result: boolean) => {
        accepted.value = result;
        dialog.close();
      },
    }),
  });

  dialog.onClose(() => {
    if (accepted.value) {
      emit('tosAccepted');
    }
  });
}
</script>

<template>
  <div>
    <h2 class="text-base font-bold line-height-loose">
      {{ $t('status') }}
    </h2>

    <div class="flex items-center">
      <template v-if="$props.status === STATUS.INIT">
        <div class="mr-6">
          <div class="i-mingcute:server-fill icon-size" />
        </div>
        <span class="text-sm">{{ $t('testConnect') }}...</span>
      </template>
      <template v-if="$props.status === STATUS.DIRECT">
        <div class="mr-6 text-success">
          <div class="i-mingcute:wifi-fill icon-size" />
        </div>
        <span class="text-sm">{{ $t('connectedDirectly') }}</span>
      </template>
      <template v-if="$props.status === STATUS.TOS_NOT_ACCEPTED">
        <div class="mr-6 text-warning">
          <div class="i-mingcute:safety-certificate-fill icon-size" />
        </div>
        <span class="text-sm">{{ $t('tosNotAccepted') }}</span>

        <BaseButton class="ml-5" @click="showTos">
          {{ $t('showTerms') }}
        </BaseButton>
      </template>
      <template v-if="$props.status === STATUS.PROXY">
        <div class="mr-6 text-success">
          <div class="i-mingcute:home-wifi-fill icon-size" />
        </div>
        <span class="text-sm">{{ $t('connectedViaProxy') }}</span>
      </template>
      <template v-if="$props.status === STATUS.PROXY_DEAD">
        <div class="mr-6 text-error">
          <div class="i-mingcute:wifi-off-fill icon-size" />
        </div>
        <span class="text-sm">{{ $t('proxyUnreachable') }}</span>
      </template>
    </div>

    <div v-focus-section class="mt-5">
      <BaseToggle :checked="forceProxy" @click="emit('toggleForceProxy')" />
      <span class="ml-4 text-sm">{{ $t('forceProxy') }}</span>
    </div>
  </div>
</template>

<style>
.icon-size {
  @apply w-2rem h-2rem
}
</style>

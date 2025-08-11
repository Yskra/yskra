<script setup lang="ts">
import type { VNode } from 'vue';
import { Icon } from '@icon';
import { refAutoReset } from '@vueuse/core';
import { h, shallowReactive, watch } from 'vue';
import { usePlayerInstance } from '@/plugins/webPlayer/instance';
import { usePlayerFullStore } from '@/plugins/webPlayer/ui/player-full/store';
import { ResolveIconComponent } from '@/utils/ResolveComponent';

const store = usePlayerFullStore();
const { mediaControls } = usePlayerInstance();

const showTooltip = refAutoReset(false, 50);
const tooltipOpts = shallowReactive<{ text: string; icon: string | VNode }>({
  text: '',
  icon: '',
});

function onRun() {
  mediaControls.playing = true;
}

watch(() => mediaControls.playing, () => {
  if (store.showRunButton) {
    store.showRunButton = false;
  }
});

watch(() => mediaControls.muted, () => {
  if (mediaControls.muted) {
    tooltip({
      icon: 'i-mingcute:volume-mute-fill',
    });
  }
  else {
    tooltip({
      icon: 'i-mingcute:volume-fill',
    });
  }
});
watch(() => store.isFullscreen, () => {
  if (store.isFullscreen) {
    tooltip({
      icon: h(Icon, { name: 'line-md-arrows-diagonal' }),
    });
  }
});
watch(() => mediaControls.playing, () => {
  if (mediaControls.playing) {
    tooltip({
      icon: 'i-mingcute:play-fill',
    });
  }
  else {
    tooltip({
      icon: 'i-mingcute:pause-fill',
    });
  }
});

function tooltip({ text, icon }: Partial<typeof tooltipOpts> = {}) {
  tooltipOpts.text = text ?? '';
  tooltipOpts.icon = icon ?? '';

  showTooltip.value = true;
}
</script>

<template>
  <div
    v-if="store.showRunButton"
    v-focus-section.autofocus
    class="center"
  >
    <BaseButton
      class="h-7em w-7em px-0"
      color="primary"
      @click="onRun"
    >
      <Icon
        name="line-md-pause-to-play-filled-transition"
        class="h-3em w-3em"
      />
    </BaseButton>
  </div>

  <Transition name="tooltip">
    <div v-if="showTooltip" class="tooltip">
      <ResolveIconComponent
        :is="tooltipOpts.icon"
        class="h-5rem w-5rem"
      >
        {{ tooltipOpts.text }}
      </ResolveIconComponent>
    </div>
  </Transition>
</template>

<style scoped>
.tooltip {
  @apply pointer-events-none rounded-box bg-base-300 p-8 op-80 absolute top-50% left-50% -translate-1/2;

  &-enter-active {
    transition: opacity .2s linear;
  }
  &-leave-active {
    transition: opacity 1s linear, transform 1.5s ease-in-out;
  }
  &-enter-to, &-leave-to {
    opacity: 0;
  }
  &-leave-to {
    @apply -translate-1/2 scale-150%;
  }
}
</style>

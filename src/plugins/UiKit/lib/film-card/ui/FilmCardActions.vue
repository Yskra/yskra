<script setup lang="ts">
import type { VNode } from 'vue';
import { ResolveIconComponent, ResolveTextComponent } from '@/utils/ResolveComponent';

export interface Action {
  action: (event: Event) => void;
  id: string;
  name: string;
  icon: string | VNode;
}

export interface Props {
  actions?: Action[];
}

defineOptions({
  inheritAttrs: false,
});

defineProps<Props>();
</script>

<template>
  <div v-focus-section.autofocus class="film-card-actions">
    <div
      v-for="(item, i) in $props.actions"
      :key="item.name"
    >
      <template v-if="i === 0">
        <BaseButton
          v-focus.autofocus
          color="primary"
          class="mr-1.5 h-15"
          @click="item.action"
        >
          <div class="flex items-center">
            <ResolveIconComponent :is="item.icon" class="mr-2 h-2rem w-2rem" />
            <ResolveTextComponent :is="item.name" />
          </div>
        </BaseButton>
      </template>
      <BaseTooltip
        v-else
        :data-tip="$te(item.name) ? $t(item.name) : item.name"
        color="primary"
      >
        <BaseButton
          color="primary"
          class="mx-1.5 h-15 w-15"
          @click="item.action"
        >
          <ResolveIconComponent :is="item.icon" class="icon-size" />
        </BaseButton>
      </BaseTooltip>
    </div>
  </div>
</template>

<style scoped>
.film-card-actions {
  @apply flex my-3;
}

.icon-size {
  @apply h-2rem w-2rem;
}
</style>

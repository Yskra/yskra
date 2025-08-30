<script setup lang="ts">
import type { VNode } from 'vue';
import { useActiveElement } from '@vueuse/core';
import { nextTick, ref, useTemplateRef, watch } from 'vue';
import { ResolveIconComponent, ResolveTextComponent } from '@/utils/ResolveComponent';
import { useRouterResolver } from '../..';

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

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'reorder', field: string, toIndex: number): void;
}>();

const sortingEnabled = ref(false);
const sortTargetId = ref<string | null>(null);
const buttonRefs = useTemplateRef<HTMLElement[]>('buttonRefs');
const containerRef = useTemplateRef<HTMLElement>('containerRef');
const activeElement = useActiveElement();

watch(sortingEnabled, (enabled) => {
  if (!enabled) {
    sortTargetId.value = null;
  }
});
watch(activeElement, (elem) => {
  if (sortingEnabled.value && containerRef.value && !containerRef.value.contains(elem as HTMLElement)) {
    sortingEnabled.value = false;
  }
});
useRouterResolver(
  () => {
    sortingEnabled.value = false;
    return true;
  },
  () => {
    if (sortingEnabled.value) {
      sortingEnabled.value = false;
      return false;
    }
    return true;
  },
);
async function keyDown(event: KeyboardEvent) {
  if (!sortingEnabled.value || !sortTargetId.value) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  const delta = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;

  emit('reorder', sortTargetId.value, delta);

  if (buttonRefs.value) {
    await nextTick();
    buttonRefs.value.find((el) => el.dataset.target === 'true')?.querySelector('button')?.focus();
  }
}

function isSortTarget(item: Action) {
  return sortTargetId.value === item.id;
}

function buttonClick(item: Action, event: Event) {
  if (sortingEnabled.value) {
    sortTargetId.value = sortTargetId.value === item.id ? null : item.id;
  }
  else {
    item.action(event);
  }
}
</script>

<template>
  <div
    ref="containerRef"
    v-focus-section.autofocus
    class="film-card-actions"
    :class="{ 'sorting-enabled': sortingEnabled }"
    @keydown.left="keyDown"
    @keydown.right="keyDown"
    @keydown.esc="sortingEnabled = false"
  >
    <div
      v-for="(item, i) in props.actions"
      :key="item.id"
      ref="buttonRefs"
      :data-target="sortTargetId === item.id || undefined"
    >
      <template v-if="i === 0">
        <BaseButton
          v-focus.autofocus
          color="primary"
          class="mr-1.5 h-15"
          :class="{ '-translate-y-5 outline-secondary': isSortTarget(item) }"
          @click="buttonClick(item, $event)"
        >
          <div class="flex items-center">
            <ResolveIconComponent
              :is="item.icon"
              class="icon-size"
              :class="{ 'mr-2': !sortingEnabled }"
            />
            <ResolveTextComponent :is="item.name" v-if="!sortingEnabled" />
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
          :class="{ '-translate-y-5': isSortTarget(item) }"
          @click="buttonClick(item, $event)"
        >
          <ResolveIconComponent :is="item.icon" class="icon-size" />
        </BaseButton>
      </BaseTooltip>
    </div>

    <BaseTooltip :data-tip="$t('sorting')" color="primary">
      <BaseButton
        :styling="sortingEnabled ? 'outline' : 'soft'"
        :color="sortingEnabled ? 'error' : 'primary'"
        class="mx-1.5 h-15 w-15"
        @click="sortingEnabled = !sortingEnabled"
      >
        <Icon :name="sortingEnabled ? 'line-md-menu-to-close-transition' : 'line-md-arrows-horizontal'" />
      </BaseButton>
    </BaseTooltip>
  </div>
</template>

<style scoped>
.film-card-actions {
  @apply flex my-3;
}

.sorting-enabled :deep(.btn:focus) {
  @apply outline-secondary;
}

.icon-size {
  @apply h-2rem w-2rem;
}
</style>

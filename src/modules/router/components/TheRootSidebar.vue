<script setup lang="ts">
import type { RouteRecord } from 'vue-router';
import { computedWithControl, useActiveElement } from '@vueuse/core';
import { computed, ref, resolveComponent, useTemplateRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAppBus } from '@/modules/appBus';
import { useI18n } from '@/modules/i18n';
import { SETTINGS_PAGES_PARENT, useUISettings } from '@/modules/settings';
import { ResolveIconComponent, ResolveTextComponent } from '@/utils/ResolveComponent';

const router = useRouter();
const bus = useAppBus();
const routes = computedWithControl(() => undefined, generateRoutes);
const { indexPageRoute } = useUISettings();
const isPresentation = bus.get('ui.background:presentationMode');
const settingsPage = { name: SETTINGS_PAGES_PARENT };
const i18n = useI18n();
const sidebarContainerRef = useTemplateRef<HTMLElement>('sidebarContainerRef');
const activeElement = useActiveElement();

const hoveredContainer = ref(false);
const compactMenu = computed(() => hoveredContainer.value ? false : (activeElement.value && sidebarContainerRef.value) ? !sidebarContainerRef.value?.contains(activeElement.value) : false);

bus.on('pluginManager.plugin:mounted', routes.trigger);
bus.on('pluginManager.plugin:mounted', routes.trigger);

watch(indexPageRoute, () => routes.trigger());

function generateRoutes(): RouteRecord[] {
  return router.getRoutes()
    .filter((r) => (
      r.meta?.title
      && !r.path.startsWith('/settings')
      && r.path !== indexPageRoute.value?.path
    )) as RouteRecord[];
}
</script>

<template>
  <div
    ref="sidebarContainerRef"
    class="sidebar-container"
    :class="{ 'bg-base-200/40': isPresentation }"
    @mouseenter="hoveredContainer = true"
    @mouseleave="hoveredContainer = false"
  >
    <div
      v-focus-section
      class="sidebar-body"
      :class="{ compact: compactMenu }"
    >
      <BaseMenu class="w-full text-base">
        <BaseMenuItem>
          <div v-focus @click="router.back()">
            <Icon name="line-md-chevron-left" class="icon-size" />
            <span v-if="!compactMenu">{{ $t('back') }}</span>
          </div>
        </BaseMenuItem>
        <BaseMenuItem modifier="disabled" />

        <BaseMenuItem>
          <AppLink
            to="/"
            exact-active-class="menu-active"
          >
            <Icon name="line-md-home-simple-filled" class="icon-size" />
            <span v-if="!compactMenu">{{ $t('home') }}</span>
          </AppLink>
        </BaseMenuItem>
        <BaseMenuItem v-for="route in routes" :key="route.path">
          <AppLink :to="route.path">
            <ResolveIconComponent
              :is="route.meta.icon"
              default-tag="span"
              class="icon-size"
            />
            <ResolveTextComponent :is="route.meta.title" v-if="!compactMenu" />
          </AppLink>
        </BaseMenuItem>
      </BaseMenu>

      <div v-if="!compactMenu" class="sidebar-bottom-area">
        <BaseTooltip :data-tip="$t('settings')">
          <BaseButton
            :is="resolveComponent('AppLink')"
            styling="outline"
            color="primary"
            class="m-1"
            :to="settingsPage"
          >
            <div class="i-mingcute:settings-5-fill h-2rem w-2rem" />
          </BaseButton>
        </BaseTooltip>
        <BaseTooltip :data-tip="$t('language')">
          <BaseSelect :title="$t('language')" @change="i18n.setLanguage">
            <template #open="{ open }">
              <BaseButton
                styling="outline"
                color="primary"
                class="m-1 mx-3"
                @click="open"
              >
                <div class="i-mingcute:translate-2-line h-2rem w-2rem" />
              </BaseButton>
            </template>
            <BaseSelectItem
              v-for="({ name, code }) of i18n.manifest"
              :key="code"
              :value="code"
              :selected="i18n.global.locale === code"
            >
              {{ name }}
            </BaseSelectItem>
          </BaseSelect>
        </BaseTooltip>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar-container {
  @apply sticky top-0 h-screen rounded-br-2xl rounded-tr-2xl bg-base-200 px-2 flex flex-col;
}
.sidebar-body {
  @apply  min-w-60 flex flex-col justify-between overflow-y-auto py-5 relative flex-grow;
}
.sidebar-body.compact {
  @apply min-w-full;
}
.sidebar-bottom-area {
  @apply p-2 flex absolute bottom-0 left-0;
}
.icon-size {
  @apply h-4rem w-2rem;
}
</style>

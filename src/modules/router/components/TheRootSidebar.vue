<script setup lang="ts">
import type { RouteRecord } from 'vue-router';
import { computedWithControl } from '@vueuse/core';
import { resolveComponent, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAppBus } from '@/modules/appBus';
import { useI18n } from '@/modules/i18n';
import { SETTINGS_PAGES_PARENT, useUISettings } from '@/modules/settings';
import { ResolveIconComponent, ResolveTextComponent } from '@/utils/ResolveComponent';

const props = defineProps<{
  compact: boolean;
}>();
const router = useRouter();
const bus = useAppBus();
const routes = computedWithControl(() => undefined, generateRoutes);
const { indexPageRoute } = useUISettings();
const isPresentation = bus.get('ui.background:presentationMode');
const settingsPage = { name: SETTINGS_PAGES_PARENT };
const i18n = useI18n();

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
    class="sidebar-container"
    :class="{ 'bg-base-200/40': isPresentation }"
  >
    <div

      class="sidebar-body"
      :class="{ compact: props.compact }"
    >
      <BaseMenu class="menu">
        <BaseMenuItem>
          <div v-focus @click="router.back()">
            <Icon name="line-md-chevron-left" class="item-icon" />
            <span class="item-text">{{ $t('back') }}</span>
          </div>
        </BaseMenuItem>
        <BaseMenuItem modifier="disabled" />

        <BaseMenuItem>
          <AppLink
            to="/"
            exact-active-class="menu-active"
          >
            <Icon name="line-md-home-simple-filled" class="item-icon" />
            <span class="item-text">{{ $t('home') }}</span>
          </AppLink>
        </BaseMenuItem>
        <BaseMenuItem v-for="route in routes" :key="route.path">
          <AppLink :to="route.path">
            <ResolveIconComponent
              :is="route.meta.icon"
              default-tag="span"
              class="item-icon"
            />
            <ResolveTextComponent :is="route.meta.title" class="item-text" />
          </AppLink>
        </BaseMenuItem>
      </BaseMenu>

      <div v-focus-section class="sidebar-bottom-area">
        <BaseTooltip :data-tip="$t('settings')">
          <BaseButton
            :is="resolveComponent('AppLink')"
            styling="outline"
            color="primary"
            class="m-1 h-3rem w-3rem p-0"
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
                class="m-1 mx-3 h-3rem w-3rem p-0"
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
  @apply sticky top-0 h-screen rounded-br-2xl rounded-tr-2xl bg-base-200 px-2 flex flex-col w-full;
}
.menu {
  @apply w-full text-base;

  li:not(.menu-title) > * {
    @apply gap-0 p-e-0;
  }
}
.sidebar-bottom-area {
  @apply p-2 flex absolute bottom-0 left-0;
}
.item-icon {
  @apply h-3rem w-2rem;
}
.item-text {
  @apply pl-3 whitespace-nowrap transition-opacity delay-0;
}

.sidebar-body {
  @apply min-w-60 flex flex-col justify-between py-5 relative flex-grow transition-min-width;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}
.reduce-motion .sidebar-body {
  transition: none;
}

.sidebar-body.compact {
  @apply min-w-4rem w-4rem duration-300 overflow-hidden;

  .menu {
    @apply pr-0;
  }
  .item-text {
    @apply op-0 w-0 delay-150;
  }
  .sidebar-bottom-area {
    @apply op-0 w-16 delay-150;
  }
}
</style>

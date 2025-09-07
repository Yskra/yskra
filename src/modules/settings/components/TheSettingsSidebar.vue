<script setup lang="ts">
import type { RouteRecord } from 'vue-router';
import { computedWithControl } from '@vueuse/core';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppBus } from '@/modules/appBus';
import { rootPages } from '@/modules/settings/addPage';
import settingsRoute from '@/modules/settings/route';
import { ResolveIconComponent, ResolveTextComponent } from '@/utils/ResolveComponent';

const props = defineProps<{
  compact: boolean;
}>();

const router = useRouter();
const bus = useAppBus();
const pluginRoutes = computedWithControl(() => undefined, generatePluginRoutes);
const nativeRouterNames = settingsRoute.children.map((r) => r.name);
const nativeRoues = computedWithControl(() => undefined, generateNativeRoutes);

onMounted(() => {
  nativeRoues.trigger();
});
bus.on('pluginManager.plugin:mounted', () => {
  pluginRoutes.trigger();
});
bus.on('pluginManager.plugin:unmounted', () => {
  pluginRoutes.trigger();
});

function generatePluginRoutes(): RouteRecord[] {
  return router.getRoutes()
    .filter((r) => r.path.startsWith('/settings/plugin/')) as RouteRecord[];
}
function generateNativeRoutes(): RouteRecord[] {
  return router.getRoutes()
    .filter((r) => (nativeRouterNames.includes(r.name as string) || rootPages.includes(r.name as string)) && r.meta?.title) as RouteRecord[];
}
</script>

<template>
  <div class="sticky top-0 h-screen w-full flex flex-col rounded-br-2xl rounded-tr-2xl bg-base-200 px-2">
    <div class="sidebar-body" :class="{ compact: props.compact }">
      <BaseMenu>
        <BaseMenuItem>
          <AppLink to="/">
            <Icon name="line-md-home-simple-filled" class="item-icon" />
            <span class="item-text">{{ $t('home') }}</span>
          </AppLink>
        </BaseMenuItem>
        <BaseMenuItem type="title">
          <span v-if="!props.compact" class="item-text">{{ $t('general') }}</span>
        </BaseMenuItem>

        <BaseMenuItem v-for="route in nativeRoues" :key="route.path">
          <AppLink :to="{ name: route.name }">
            <ResolveIconComponent
              :is="route.meta.icon"
              default-tag="span"
              class="item-icon"
            />

            <ResolveTextComponent :is="route.meta.title" class="item-text" />
          </AppLink>
        </BaseMenuItem>

        <template v-if="pluginRoutes.length">
          <BaseMenuItem type="title">
            <span v-if="!props.compact" class="item-text">{{ $t('plugins') }}</span>
          </BaseMenuItem>

          <BaseMenuItem v-for="route in pluginRoutes" :key="route.path">
            <AppLink :to="route.path">
              <span class="i-mingcute:plugin-2-line item-icon" />
              <ResolveTextComponent :is="route.meta.title" class="item-text" />
            </AppLink>
          </BaseMenuItem>
        </template>
      </BaseMenu>
    </div>
  </div>
</template>

<style scoped>
.menu {
  @apply w-full text-base;

  li:not(.menu-title) > * {
    @apply gap-0 p-e-0;
  }

  li:empty {
    margin: 0.6rem 1rem;
    --color-base-content: transparent;
  }
}
.item-icon {
  @apply h-3rem w-2rem;
}
.item-text {
  @apply pl-3 whitespace-nowrap transition-opacity delay-0;
}

.sidebar-body {
  @apply overflow-auto min-w-60 flex flex-col justify-between py-5 relative flex-grow transition-min-width;

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
}
</style>

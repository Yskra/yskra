<script setup lang="ts">
import type { RouteRecord } from 'vue-router';
import { computedWithControl } from '@vueuse/core';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppBus } from '@/modules/appBus';
import { rootPages } from '@/modules/settings/addPage';
import settingsRoute from '@/modules/settings/route';
import { ResolveIconComponent, ResolveTextComponent } from '@/utils/ResolveComponent';

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
  <div class="sticky top-0 h-screen rounded-br-2xl rounded-tr-2xl bg-base-200 px-2">
    <div class="h-full min-w-60 flex flex-col justify-between overflow-y-auto py-5">
      <BaseMenu class="w-full">
        <BaseMenuItem>
          <div v-focus @click="router.back()">
            <Icon name="line-md-chevron-left" class="h-2rem w-2rem" />
            <span>{{ $t('back') }}</span>
          </div>
        </BaseMenuItem>
        <BaseMenuItem>
          <AppLink to="/">
            <Icon name="line-md-home-simple-filled" class="h-2rem w-2rem" />
            <span>{{ $t('home') }}</span>
          </AppLink>
        </BaseMenuItem>
        <BaseMenuItem type="title">
          {{ $t('general') }}
        </BaseMenuItem>

        <BaseMenuItem v-for="route in nativeRoues" :key="route.path">
          <AppLink :to="{ name: route.name }">
            <ResolveIconComponent
              :is="route.meta.icon"
              default-tag="span"
              class="h-2rem w-2rem"
            />

            <ResolveTextComponent :is="route.meta.title" />
          </AppLink>
        </BaseMenuItem>

        <template v-if="pluginRoutes.length">
          <BaseMenuItem type="title">
            {{ $t('plugins') }}
          </BaseMenuItem>

          <BaseMenuItem v-for="route in pluginRoutes" :key="route.path">
            <AppLink :to="route.path">
              <span class="i-mingcute:plugin-2-line h-2rem w-2rem" />
              <ResolveTextComponent :is="route.meta.title" />
            </AppLink>
          </BaseMenuItem>
        </template>
      </BaseMenu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteUpdate, RouterLink, useRoute } from 'vue-router';
import { useAppBus } from '@/modules/appBus';
import TheRootSidebar from '@/modules/router/components/TheRootSidebar.vue';
import { useUISettings } from '@/modules/settings';
import { useTitle } from '@/utils/title';

const { indexPageRoute } = useUISettings();
const route = useRoute();
const bus = useAppBus();
const { t, te } = useI18n();

onBeforeRouteUpdate(clearBg);
onUnmounted(clearBg);
useTitle(() =>
  route.meta.title ? resolveI18nTitle(route.meta.title) : route.path === '/' ? t('home') : 'Yskra',
);

function resolveI18nTitle(key: string) {
  return te(key) ? t(key) : key;
}
function clearBg() {
  bus.call('ui.background:setImage', '');
  bus.set('ui.background:presentationMode', false);
}
</script>

<template>
  <BackgroundImageLayout>
    <SidebarLayout>
      <template #sidebar="{ compactSidebar }">
        <TheRootSidebar :compact="compactSidebar" />
      </template>

      <template v-if="route.path === '/'">
        <RouterView v-if="indexPageRoute" :route="indexPageRoute" />

        <div v-else>
          <div class="h-full w-full flex flex-col items-center py-30">
            <h1 class="mb-3 text-3xl font-bold">
              {{ $t('homeNotSelected') }}
            </h1>
            <BaseButton
              :is="RouterLink"
              :to="{ name: 'settingsUI' }"
              color="primary"
              modifier="wide"
            >
              <span>{{ $t('configure') }}</span>
            </BaseButton>
          </div>
        </div>
      </template>

      <RouterView v-else />
    </SidebarLayout>
  </BackgroundImageLayout>
</template>

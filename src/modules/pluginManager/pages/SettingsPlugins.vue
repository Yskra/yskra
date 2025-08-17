<script setup lang="ts">
import { usePluginManager } from '@/modules/pluginManager';
import SettingsPluginsCard2 from '@/modules/pluginManager/components/SettingsPluginsCard2.vue';
import SettingsPluginsCardInfo2 from '@/modules/pluginManager/components/SettingsPluginsCardInfo2.vue';
import { DOCS_URL } from '@/modules/pluginManager/constants';
import SettingsPluginsCard from '../components/SettingsPluginsCard.vue';
import SettingsPluginsCardInfo from '../components/SettingsPluginsCardInfo.vue';
import { useSettingsPluginsPage } from '../composables/settingsPluginsPage';

const { installedPlugins, notLoadedSources } = usePluginManager();
const {
  showPluginInfo,
  showPluginInfoTarget,
  showPluginInfo2,
  sourceError,
  pluginInfo,
  pluginInfo2,
  repos,
  pluginsCatalog,
  add,
  rmRepo,
  getPluginName,
  openPluginInfo,
  openPluginInfo2,
} = useSettingsPluginsPage();
</script>

<template>
  <div>
    <div v-focus-section class="flex items-start justify-between">
      <BaseMenu class="w-full border-1 border-base-300 rounded-md bg-base-200">
        <BaseMenuItem v-for="repo in repos" :key="repo.url">
          <div class="flex justify-between">
            <div class="flex flex-col items-start">
              <h1 v-if="repo.error" class="text-sm text-error underline">
                {{ $t('error') }}: {{ repo.error }}
              </h1>
              <p v-else class="mb-2 text-sm">
                {{ repo.name }} | {{ $t('pluginsLength', { length: repo.pluginsLength }) }}
              </p>
              <p class="text-xs line-height-none op-60">
                {{ repo.url }}
              </p>
            </div>
            <BaseTooltip :data-tip="$t('removeRepo')">
              <BaseButton
                color="error"
                styling="outline"
                class="h-2.5rem w-2.5rem p-3"
                @click="rmRepo(repo.url as string, repo.name, $event)"
              >
                <div class="i-mingcute:delete-2-fill h-2rem w-2rem" />
              </BaseButton>
            </BaseTooltip>
          </div>
        </BaseMenuItem>
        <BaseMenuItem class="border-1 border-info rounded-md">
          <a
            :href="DOCS_URL.GUIDE_INTRODUCTION.href"
            target="_blank"
            class="py-0!"
          >
            <span class="i-mingcute:book-2-fill" />
            <span>{{ $t('wantToCreateYourOwnPlugin') }}</span>
          </a>
        </BaseMenuItem>
      </BaseMenu>

      <BaseTooltip :data-tip="$t('addPluginOrRepo')">
        <BaseButton
          size="md"
          styling="outline"
          color="primary"
          class="ml-5 h-4.3rem w-4rem"
          @click.stop="add"
        >
          <Icon name="line-md-plus" class="h-2rem w-2rem" />
        </BaseButton>
      </BaseTooltip>
    </div>
  </div>

  <div class="my-5 w-full">
    <BaseDivider class="w-full" placement="start">
      {{ $t('installed') }}
    </BaseDivider>

    <div v-focus-section class="flex flex-wrap">
      <SettingsPluginsCard
        v-for="plugin in installedPlugins"
        :key="plugin.id"
        class="m-1"
        :plugin="plugin"
        :get-plugin-name="getPluginName"
        @click="openPluginInfo(plugin, $event)"
      />
      <SettingsPluginsCard2
        v-for="error in notLoadedSources"
        :key="error.source.href"
        class="m-1"
        :error="error"
        @click="openPluginInfo2(error, $event)"
      />
    </div>

    <template v-if="pluginsCatalog && Object.keys(pluginsCatalog).length">
      <BaseDivider class="w-full" placement="start">
        {{ $t('catalog') }}
      </BaseDivider>

      <div v-focus-section class="flex flex-wrap">
        <SettingsPluginsCard
          v-for="plugin in pluginsCatalog"
          :key="plugin.id"
          :plugin="plugin"
          class="m-1"
          :get-plugin-name="getPluginName"
          @click="openPluginInfo(plugin, $event)"
        />
      </div>
    </template>
  </div>

  <YDrawer
    v-model:show="showPluginInfo"
    :title="$t('pluginName', { name: pluginInfo.name })"
    :target-ref="showPluginInfoTarget"
  >
    <SettingsPluginsCardInfo :plugin-info="pluginInfo" />
  </YDrawer>

  <YDrawer
    v-model:show="showPluginInfo2"
    :title="$t('pluginName', { name: sourceError.source.pathname })"
    :target-ref="showPluginInfoTarget"
  >
    <SettingsPluginsCardInfo2 :error="sourceError" :plugin-info="pluginInfo2" />
  </YDrawer>
</template>

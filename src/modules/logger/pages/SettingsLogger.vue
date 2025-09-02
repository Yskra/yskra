<script setup lang="ts">
import { UseClipboard } from '@vueuse/components';
import { ref } from 'vue';
import LoggerItem from '@/modules/logger/components/LoggerItem.vue';
import { filteredEntries, saveLogs } from '@/modules/logger/stores/logs';

const LEVELS = Object.freeze([
  { value: 'info', label: 'Информация' },
  { value: 'warn', label: 'Предупреждения' },
  { value: 'error', label: 'Ошибки' },
]);

const showModal = ref(false);
const targetRef = ref<HTMLElement>();
const modalMsg = ref({ title: '', full: '' });

function openDetails(event: Event, msg: { title: string; full: string }) {
  showModal.value = true;
  modalMsg.value = msg;
  targetRef.value = event.target as HTMLElement;
}
</script>

<template>
  <div class="w-full flex flex-col items-end">
    <div class="flex items-center">
      <BaseButton class="ml-3" @click="saveLogs">
        {{ $t('saveLogs') }}
      </BaseButton>
    </div>

    <BaseTabs styling="border" class="mt-2">
      <BaseTabsItem
        v-for="({ messages, meta, getters }, id) in filteredEntries"
        :key="id"
      >
        <template #tab>
          <h2 class="text-sm">
            {{ meta.context }}
          </h2>
          <BaseBadge
            size="sm"
            :color="`${getters.hasErrors ? 'error' : 'neutral'}`"
            class="ml-2"
          >
            {{ messages.length }}
          </BaseBadge>
        </template>
        <div v-focus-section class="tab-content">
          <div v-if="messages.length === 0" class="mt-5 flex items-center justify-center">
            <div class="i-mingcute:broom-fill mr-2 h-2rem w-2rem" />
            <span class="text-center">
              {{ $t('noLogs') }}
            </span>
          </div>
          <LoggerItem
            v-for="({ level, date, message }, ii) in messages"
            v-else
            :key="`${id}-${ii}`"
            v-focus
            :level="level"
            :message="message"
            :date="date"
            @open-details="openDetails"
          />
        </div>
      </BaseTabsItem>
    </BaseTabs>

    <YModal
      v-model:show="showModal"
      :title="modalMsg.title"
      :target-ref="targetRef"
    >
      <pre class="mb-2 max-h-40vh max-w-90vw overflow-x-auto rounded bg-base-300 p-2 text-sm">{{ modalMsg.full }}</pre>

      <template #footer="{ close }">
        <div class="flex justify-end">
          <UseClipboard v-slot="{ copy, copied }" :source="modalMsg.full">
            <BaseButton
              color="primary"
              class="mx-1 w-10rem"
              @click="copy"
            >
              {{ copied ? $t('copied') : $t('copy') }}
            </BaseButton>
          </UseClipboard>
          <BaseButton class="mx-1" @click="close">
            {{ $t('close') }}
          </BaseButton>
        </div>
      </template>
    </YModal>
  </div>
</template>

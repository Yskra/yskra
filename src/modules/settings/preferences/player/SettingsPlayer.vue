<script setup lang="ts">
import { usePlayerSettings } from '@/modules/settings';

const { defaultPlayer, players } = usePlayerSettings();
</script>

<template>
  <BaseSelect
    :title="$t('defaultPlayer')"
    @change="defaultPlayer = $event"
  >
    <BaseSelectItem
      v-for="option in players"
      :key="option.name"
      :value="option.name"
      :selected="defaultPlayer === option.name"
    >
      {{ option.name }}
    </BaseSelectItem>
  </BaseSelect>
</template>


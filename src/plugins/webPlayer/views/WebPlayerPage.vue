<script setup lang="ts">
import { toRef } from 'vue';
import { useRoute } from 'vue-router';
import { useResolveSource } from '@/plugins/webPlayer/utils/resolveSourse.js';
import { PlayerFull } from '../ui';

const route = useRoute();
const url = toRef(() => route.query.url as string);
const listUrl = toRef(() => route.query.list as string);
const forcePlayerType = toRef(() => route.query.type as string);
const playerOptsFromUrl = toRef(() => JSON.parse((route.query.playerOpts as string) ?? '{}'));
const position = toRef(() => route.query.index ? Number.parseInt(route.query.index as string, 10) : 0);
const resolvedUrl = useResolveSource(url, listUrl, position);
</script>

<template>
  <PlayerFull
    :url="resolvedUrl"
    :player-type="forcePlayerType"
    :player-opts="playerOptsFromUrl"
  />
</template>

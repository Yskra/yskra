<script setup lang="ts">
import { inject } from 'vue';
import { BaseButton } from '.';
import { FILTER_INJECT_KEY } from './base-filter.vue';
import getVanillaInput from './vanila-input';

/** @docs https://daisyui.com/components/filter/ */

export interface Props {
  label?: string;
  type?: 'reset' | 'value';
}

defineProps<Props>();

const Reset = getVanillaInput('reset');
const Radio = getVanillaInput('radio');

const name = inject(FILTER_INJECT_KEY);
</script>

<template>
  <BaseButton
    :is="type === 'reset' ? Reset : Radio"
    :aria-label="label"
    :name="name"
  />
</template>

<style>

</style>

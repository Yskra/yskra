<script setup lang="ts">
export interface Props {
  budget?: string;
  revenue?: string;
  productionCountries?: { id: unknown; name: string }[];
  isLoading: boolean;
}

defineOptions({
  inheritAttrs: false,
});

defineProps<Props>();
</script>

<template>
  <div class="">
    <BaseTable class="w-full">
      <thead>
        <tr>
          <th v-if="budget" class="text-start">
            {{ $t('budget') }}
          </th>
          <th v-if="revenue" class="text-start">
            {{ $t('revenue') }}
          </th>
          <th v-if="productionCountries" class="text-start">
            {{ $t('productionCountries') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td v-if="budget">
            <BaseSkeleton v-if="isLoading" class="h-4 w-40" />
            <span v-else>{{ budget }}</span>
          </td>
          <td v-if="revenue">
            <BaseSkeleton v-if="isLoading" class="h-4 w-40" />
            <span v-else>{{ revenue }}</span>
          </td>
          <td v-if="productionCountries">
            <BaseSkeleton v-if="isLoading" class="h-4 w-80" />
            <span v-else>
              {{ productionCountries.map((e) => e.name).join(', ') }}
            </span>
          </td>
        </tr>
      </tbody>
    </BaseTable>
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <div v-focus-section>
    <BaseTooltip placement="bottom" :data-tip="$t('back')">
      <BaseButton
        class="button"
        color="primary"
        @click="router.back()"
      >
        <Icon name="line-md-chevron-left" class="button-icon-size" />
      </BaseButton>
    </BaseTooltip>
    <!--  <BaseTooltip type="right" :data-tip="'Мини-проигрыватель' + ' (i)'"> -->
    <!--    <BaseButton -->
    <!--      class="w-3rem px-0" -->
    <!--      color="primary" -->
    <!--      @click="store.playerToMin" -->
    <!--    > -->
    <!--      <Icon name="line-md-chevron-down" class="h-2rem w-2rem" /> -->
    <!--    </BaseButton> -->
    <!--  </BaseTooltip> -->
  </div>
</template>


<style scoped>
.button {
  @apply w-4rem h-4rem;

  &-icon-size {
    @apply h-2rem w-2rem;
  }
}
</style>

/** @import {Ref, ModelRef} from 'vue' */
import { computed, h, nextTick, reactive, ref, toRef, watch } from 'vue';

// @unocss-include

/**
 * @param {Ref<number>} x clientX
 * @param {Ref<number>} y clientY
 * @param {Ref<boolean>|ModelRef<boolean>} isShow show active animation
 * @param {Ref<boolean>=} isActive optional active state - make it more transparent so the background doesn't go completely black when multiple modals are open
 */
export function createRipple(x, y, isShow, isActive = ref(true)) {
  const width = toRef(() => document.documentElement.offsetWidth);
  const height = toRef(() => document.documentElement.offsetHeight);

  const dx = toRef(() => x.value);
  const dy = toRef(() => y.value);
  const isZeroCoords = computed(() => dx.value === 0 && dy.value === 0);
  const maxX = computed(() => Math.max(dx.value, width.value - dx.value));
  const maxY = computed(() => Math.max(dy.value, height.value - dy.value));
  const radius = computed(() => Math.sqrt((maxX.value * maxX.value) + (maxY.value * maxY.value)));
  const classes = ref(new Set(['bg-#0006 rounded-full absolute top-0 left-0 pointer-events-none']));

  const style = reactive({
    marginLeft: `0`,
    marginTop: `0`,
    width: `0`,
    height: `0`,
  });

  watch([isShow, dy, dx], async ([isShow]) => {
    if (isShow) {
      if (isZeroCoords.value) {
        classes.value.add('transition-opacity');
      }
      else {
        classes.value.add('transition-[width,height,opacity,margin]');
      }

      await nextTick(); // wait when set start position on block else

      style.marginLeft = `${dx.value - radius.value}px`;
      style.marginTop = `${dy.value - radius.value}px`;
      style.width = `${radius.value * 2}px`;
      style.height = `${radius.value * 2}px`;

      classes.value.add('ease-[cubic-bezier(0.4,0.0,0.2,1)]');
      classes.value.add('duration-500');

      await nextTick(); // switch open animation to closed faster animation
      classes.value.delete('duration-500');
      classes.value.add('duration-100');
    }
    else {
      if (isZeroCoords.value) {
        classes.value.delete('duration-100');
      }

      style.marginLeft = `${dx.value}px`;
      style.marginTop = `${dy.value}px`;
      style.width = `0`;
      style.height = `0`;

      await nextTick(); // wait when animation ended if it has
      classes.value.delete('ease-[cubic-bezier(0.4,0.0,0.2,1)]');
      classes.value.delete('transition-[width,height,opacity,margin]');
      classes.value.delete('transition-opacity');
      classes.value.delete('duration-100');
    }
  }, { immediate: true });

  watch(isActive, (value) => {
    if (value) {
      classes.value.delete('bg-opacity-20');
    }
    else {
      classes.value.add('bg-opacity-20');
    }
  }, { immediate: true });

  return h(() => h('div', {
    class: [...classes.value.values()],
    style,
  }));
}

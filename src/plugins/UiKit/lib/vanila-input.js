import { defineComponent, h } from 'vue';

/**
 * @param {string} type
 */
export default function getVanillaInput(type) {
  return defineComponent((props, ctx) => {
    return () => h('input', {
      type,
      value: props.modelValue || props.value,
      onInput: (/** @type {{ target: HTMLInputElement }} */ event) => ctx.emit('update:modelValue', event.target.value),
    });
  }, {
    props: ['value', 'modelValue'],
    emits: ['update:modelValue'],
  });
}

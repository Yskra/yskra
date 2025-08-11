import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { h } from 'vue';
import { ResolveIconComponent, ResolveTextComponent } from '../ResolveComponent.js';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    te: vi.fn((key) => key === 'existing.key'),
    t: vi.fn((key) => `translated_${key}`),
  }),
}));

describe('resolveTextComponent', () => {
  it('should return null when is prop is falsy', () => {
    const wrapper = mount({
      render: () => ResolveTextComponent({ is: undefined }),
    });

    expect(wrapper.element.nodeName).toBe('#comment');
  });

  it('should return VNode as is when it is already a VNode', () => {
    const testVNode = h('div', 'test content');
    const wrapper = mount({
      render: () => ResolveTextComponent({ is: testVNode }),
    });

    expect(wrapper.find('div').text()).toBe('test content');
  });

  it('should create element with translated text when key exists', () => {
    const wrapper = mount({
      render: () => ResolveTextComponent({ is: 'existing.key', defaultTag: 'span' }),
    });

    expect(wrapper.find('span').text()).toBe('translated_existing.key');
  });

  it('should create element with original text when key does not exist', () => {
    const wrapper = mount({
      render: () => ResolveTextComponent({ is: 'non.existing.key', defaultTag: 'span' }),
    });

    expect(wrapper.find('span').text()).toBe('non.existing.key');
  });

  it('should use default tag span when not specified', () => {
    const wrapper = mount({
      render: () => ResolveTextComponent({ is: 'some.text' }),
    });

    expect(wrapper.find('span').exists()).toBe(true);
  });

  it('should use custom defaultTag', () => {
    const wrapper = mount({
      render: () => ResolveTextComponent({ is: 'some.text', defaultTag: 'div' }),
    });

    expect(wrapper.find('div').exists()).toBe(true);
  });
});

describe('resolveIconComponent', () => {
  it('should return null when is prop is falsy', () => {
    const wrapper = mount({
      render: () => ResolveIconComponent({ is: undefined }),
    });

    expect(wrapper.element.nodeName).toBe('#comment');
  });

  it('should return VNode as is when it is already a VNode', () => {
    const testVNode = h('i', { class: 'custom-icon' }, 'icon');
    const wrapper = mount({
      render: () => ResolveIconComponent({ is: testVNode }),
    });

    expect(wrapper.find('i.custom-icon').exists()).toBe(true);
  });

  it('should create element with class when is is a string', () => {
    const wrapper = mount({
      render: () => ResolveIconComponent({ is: 'fa fa-user', defaultTag: 'span' }),
    });
    const element = wrapper.find('span');

    expect(element.exists()).toBe(true);
    expect(element.classes()).toContain('fa');
    expect(element.classes()).toContain('fa-user');
  });

  it('should use default tag div when not specified', () => {
    const wrapper = mount({
      render: () => ResolveIconComponent({ is: 'icon-class' }),
    });

    expect(wrapper.find('div').exists()).toBe(true);
  });

  it('should use custom defaultTag', () => {
    const wrapper = mount({
      render: () => ResolveIconComponent({ is: 'icon-class', defaultTag: 'i' }),
    });

    expect(wrapper.find('i').exists()).toBe(true);
  });
});

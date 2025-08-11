// @ts-nocheck
/** @import {Plugin as PostcssPlugin, Root} from 'postcss' */

import postcss, { Declaration } from 'postcss';
import { expect, it } from 'vitest';
import plugin from '../resolve-color-mix-vars.js';

const colorVarAliases = Object.freeze({
  'color-success_80_black': 'color-success-20darker',
});

const processor = postcss([plugin(colorVarAliases)]);

/** @type {Root} */
const themeAtTree = postcss().process(`
:root, [data-theme=dark] {
    --color-base-100: rgb(29, 35, 42);
    --color-base-200: rgb(25, 30, 36);
    --color-base-content: rgb(243, 248, 255);
    --color-primary: rgb(96, 93, 255);
    --color-primary-content: rgb(237, 241, 254);
    --color-info: rgb(0, 185, 250);
    --color-success: rgb(0, 208, 147);
    --depth: 1;
    --color-black: #000;
}`, { from: undefined }).result.root;

it('resolve single var', async () => {
  const theme = themeAtTree.clone();
  const input = `${theme} .a { background-color: color-mix(in oklab, var(--color-base-100) 20%, transparent); }`;

  theme.nodes[0].append(new Declaration({
    prop: '--color-base-100_20_transparent',
    value: 'color-mix(in oklab,rgb(29, 35, 42) 20%, transparent)',
  }));
  const output = `${theme} .a { background-color: var(--color-base-100_20_transparent); }`;
  const result = await processor.process(input, { from: undefined });

  expect(result.css).toBe(output);
});

it('resolve multiple vars', async () => {
  const theme = themeAtTree.clone();
  const input = `${theme} .a { color: color-mix(in oklab, var(--color-base-100) 20%, var(--color-black)); }`;

  theme.nodes[0].append(new Declaration({
    prop: '--color-base-100_20_color-black',
    value: 'color-mix(in oklab,rgb(29, 35, 42) 20%,#000)',
  }));
  const output = `${theme} .a { color: var(--color-base-100_20_color-black); }`;
  const result = await processor.process(input, { from: undefined });

  expect(result.css).toBe(output);
});

it('resolve var with alias', async () => {
  const theme = themeAtTree.clone();
  const input = `${theme} .a { background-color: color-mix(in oklab, var(--color-success) 80%, black); }`;

  theme.nodes[0].append(new Declaration({
    prop: '--color-success-20darker',
    value: 'color-mix(in oklab,rgb(0, 208, 147) 80%, black)',
  }));
  const output = `${theme} .a { background-color: var(--color-success-20darker); }`;
  const result = await processor.process(input, { from: undefined });

  expect(result.css).toBe(output);
});


it('resolve currentColor as color in rule', async () => {
  const theme = themeAtTree.clone();
  const input = `${theme} .a { border: 1px solid color-mix(in srgb, currentColor 20%, transparent); color: var(--color-info); }`;

  theme.nodes[0].append(new Declaration({
    prop: '--color-info_20_transparent',
    value: 'color-mix(in srgb,rgb(0, 185, 250) 20%, transparent)',
  }));
  const output = `${theme} .a { border: 1px solid var(--color-info_20_transparent); color: var(--color-info); }`;
  const result = await processor.process(input, { from: undefined });

  expect(result.css).toBe(output);
});

it('cant resolve currentColor as color in rule', async () => {
  const theme = themeAtTree.clone();
  const input = `${theme} .a { --btn-fg: color-mix(in srgb, currentColor 20%, transparent); }`;

  const output = `${theme} .a { --btn-fg: color-mix(in srgb, currentColor 20%, transparent); }`;
  const result = await processor.process(input, { from: undefined });

  expect(result.css).toBe(output);
});

it('resolve var and calc function', async () => {
  const theme = themeAtTree.clone();
  const input = `${theme} .a { background-color: color-mix(in oklab, var(--color-base-100) calc(var(--depth) * 100%), transparent); }`;

  theme.nodes[0].append(new Declaration({
    prop: '--color-base-100_depth_100_transparent',
    value: 'color-mix(in oklab,rgb(29, 35, 42) 100%, transparent)',
  }));
  const output = `${theme} .a { background-color: var(--color-base-100_depth_100_transparent); }`;
  const result = await processor.process(input, { from: undefined });

  expect(result.css).toBe(output);
});

it('resolve var on other rule', async () => {
  const theme = themeAtTree.clone();
  const input = `${theme} 
  .btn { 
    --btn-border: color-mix(in oklab, var(--btn-color), black calc(var(--depth) * 5%)); 
  }
  .btn-primary {
    --btn-color: var(--color-primary);
    --btn-fg: var(--color-primary-content)
  }`;

  theme.nodes[0].append(new Declaration({
    prop: '--btn-color_black_depth_5',
    value: 'color-mix(in oklab, var(--btn-color), black 5%)',
  }));
  const output = `${theme} 
  .btn { 
    --btn-border: var(--btn-color_black_depth_5); 
  }
  .btn-primary {
    --btn-color: var(--color-primary);
    --btn-fg: var(--color-primary-content)
  }
  :root[data-theme=dark] .btn-primary, [data-theme=dark] .btn-primary {
    --btn-color_black_depth_5: color-mix(in oklab,rgb(96, 93, 255), black 5%);
}`;
  const result = await processor.process(input, { from: undefined });

  expect(result.css).toBe(output);
});

it('resolve recursive var', async () => {
  const theme = themeAtTree.clone();
  const input = `${theme} 
  .btn {
    --btn-color: var(--color-primary);
    --btn-border: color-mix(in oklab, var(--btn-color), black calc(var(--depth) * 5%)); 
  }`;

  theme.nodes[0].append(new Declaration({
    prop: '--btn-color_black_depth_5',
    value: 'color-mix(in oklab,rgb(96, 93, 255), black 5%)',
  }));
  const output = `${theme} 
  .btn {
    --btn-color: var(--color-primary);
    --btn-border: var(--btn-color_black_depth_5); 
  }`;
  const result = await processor.process(input, { from: undefined });

  expect(result.css).toBe(output);
});

it('resolve recursive var on other rule', async () => {
  const theme = themeAtTree.clone();
  const input = `${theme} 
  .btn { 
    --btn-bg: var(--btn-color, var(--color-base-200));
    --btn-border: color-mix(in oklab, var(--btn-bg), black calc(var(--depth) * 5%)); 
  }
  .btn-primary {
    --btn-color: var(--color-primary);
    --btn-fg: var(--color-primary-content)
  }`;

  theme.nodes[0].append(new Declaration({
    prop: '--btn-bg_black_depth_5',
    value: 'color-mix(in oklab,rgb(25, 30, 36), black 5%)',
  }));
  const output = `${theme} 
  .btn { 
    --btn-bg: var(--btn-color, var(--color-base-200));
    --btn-border: var(--btn-bg_black_depth_5); 
  }
  .btn-primary {
    --btn-color: var(--color-primary);
    --btn-fg: var(--color-primary-content)
  }
  :root[data-theme=dark] .btn-primary, [data-theme=dark] .btn-primary {
    --btn-bg_black_depth_5: color-mix(in oklab,rgb(96, 93, 255), black 5%);
}`;
  const result = await processor.process(input, { from: undefined });

  expect(result.css).toBe(output);
});


import postcss from 'postcss';
import { expect, it } from 'vitest';
import plugin from '../theme-fix.js';

const processor = postcss([plugin()]);

it('regular behavior', async () => {
  const input = `:root:has(input.theme-controller[value=dark]:checked),[data-theme=dark] {--base: back;}`;
  const output = `[data-theme=dark] {--base: back;}`;
  const result = await processor.process(input, { from: undefined });

  expect(result.css).toBe(output);
});

it('already fixed theme', async () => {
  const input = `[data-theme=light] {--base: white;}`;
  const output = `[data-theme=light] {--base: white;}`;
  const result = await processor.process(input, { from: undefined });

  expect(result.css).toBe(output);
});

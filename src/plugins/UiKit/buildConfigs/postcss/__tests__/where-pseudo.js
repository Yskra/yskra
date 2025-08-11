import postcss from 'postcss';
import { expect, it } from 'vitest';
import plugin from '../where-pseudo.js';

const processor = postcss([plugin()]);

it(':where with contents', async () => {
  const input = `div :where(.a, .b) p { color: red; }`;
  const output = `div .a p, div .b p { color: red; }`;
  const result = await processor.process(input, { from: undefined });

  expect(result.css).toBe(output);
});

it(':where with other selectors', async () => {
  const input = `div > :where(.a) p, b:before { color: red; }`;
  const output = `div > .a p, b:before { color: red; }`;
  const result = await processor.process(input, { from: undefined });

  expect(result.css).toBe(output);
});

it('single :where', async () => {
  const input = `:where(div > .a .b) { color: red; }`;
  const output = `div > .a .b { color: red; }`;
  const result = await processor.process(input, { from: undefined });

  expect(result.css).toBe(output);
});

it('multiple :where whit multiple other selectors', async () => {
  const input = `a, .b, input :where(input):focus, .input, .f :where(li > details > summary) { color: red; }`;
  const output = `a, .b, input input:focus, .input, .f li > details > summary { color: red; }`;
  const result = await processor.process(input, { from: undefined });

  expect(result.css).toBe(output);
});

it('multiple :where whit multiple other selectors 2', async () => {
  const input = `a:is([open]) > .b, .c:not(.close) > :where(input:is([type="checkbox"])):checked ~ .d { color: red; }`;
  const output = `a:is([open]) > .b, .c:not(.close) > input:is([type="checkbox"]):checked ~ .d { color: red; }`;
  const result = await processor.process(input, { from: undefined });

  expect(result.css).toBe(output);
});

it('with universal selector', async () => {
  const input = `.a .b:where(*:not(:first-child)) { margin-left:0; }`;
  const output = `.a .b *:not(:first-child) { margin-left:0; }`;
  const result = await processor.process(input, { from: undefined });

  expect(result.css).toBe(output);
});

it('preserves other CSS structures', async () => {
  const input = `.normal-class p { margin: 0; }`;
  const output = `.normal-class p { margin: 0; }`;
  const result = await processor.process(input, { from: undefined });

  expect(result.css).toBe(output);
});

it(':where complex selectors', async () => {
  const input = `:where(.header > a, .footer + a) b { display: block; }`;
  const output = `.header > a b, .footer + a b { display: block; }`;
  const result = await processor.process(input, { from: undefined });

  expect(result.css).toBe(output);
});

it(':where inside media queries', async () => {
  const input = ` @media screen and (max-width: 600px) { :where(.mobile, .tablet) a {  font-size: 16px; }}`;
  const output = ` @media screen and (max-width: 600px) { .mobile a, .tablet a {  font-size: 16px; }}`;
  const result = await processor.process(input, { from: undefined });

  expect(result.css).toBe(output);
});

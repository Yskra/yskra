/** @import {ScaleModes} from './Public'; */

export const ROUTE_NAME = 'player';
export const INJECT_KEY = Symbol(import.meta.env.DEV ? 'webPlayer' : '');

/** @type {ScaleModes} */
export const SCALE_MODES = Object.freeze({
  custom: { calc: (custom) => ({ transform: `scaleX(${custom}) scaleY(${custom})` }) },
  fill: { calc: () => ({ objectFit: 'fill' }) },
  fit: { calc: () => ({ objectFit: 'cover' }) },
});

export const SPEED_PRESETS = Object.freeze([
  { value: 0.5, locKey: 'slow' },
  { value: 1, locKey: 'normal' },
  { value: 1.2, locKey: 'medium' },
  { value: 1.5, locKey: 'fast' },
  { value: 1.7, locKey: 'veryFast' },
  { value: 2, locKey: 'superFast' },
]);

export const SCALE_PRESETS = Object.freeze([
  { mode: 'custom', locKey: 'noScale', value: 1 },
  { mode: 'fill', locKey: 'fit', value: undefined },
  { mode: 'fit', locKey: 'fill', value: undefined },
  { mode: 'custom', text: '105%', value: 1.05 },
  { mode: 'custom', text: '110%', value: 1.10 },
  { mode: 'custom', text: '125%', value: 1.25 },
  { mode: 'custom', text: '130%', value: 1.3 },
  { mode: 'custom', text: '135%', value: 1.35 },
  { mode: 'custom', text: '140%', value: 1.4 },
]);

import type { ComponentHighLighterOptions } from './types';
import { CARD_ELEMENT_ID, COMPONENT_NAME_ELEMENT_ID, CONTAINER_ELEMENT_ID, INDICATOR_ELEMENT_ID } from './constants';

export const getContainerElement = () => document.getElementById(CONTAINER_ELEMENT_ID);
export const getCardElement = () => document.getElementById(CARD_ELEMENT_ID);
export const getIndicatorElement = () => document.getElementById(INDICATOR_ELEMENT_ID);
export const getNameElement = () => document.getElementById(COMPONENT_NAME_ELEMENT_ID);

export function getStyles(bounds: ComponentHighLighterOptions['bounds']): Partial<CSSStyleDeclaration> {
  return {
    left: `${Math.round(bounds.left * 100) / 100}px`,
    top: `${Math.round(bounds.top * 100) / 100}px`,
    width: `${Math.round(bounds.width * 100) / 100}px`,
    height: `${Math.round(bounds.height * 100) / 100}px`,
  };
}

export const CONTAINER_ELEMENT_ID = '__vue-devtools-element-inspector__';
export const CARD_ELEMENT_ID = '__vue-devtools-element-inspector__card__';
export const COMPONENT_NAME_ELEMENT_ID = '__vue-devtools-element-inspector__name__';
export const INDICATOR_ELEMENT_ID = '__vue-devtools-element-inspector__indicator__';

export const containerStyles = Object.freeze({
  display: 'block',
  zIndex: 2147483640,
  position: 'fixed',
  backgroundColor: '#42B8B526',
  border: '1px solid #42B8B54F',
  borderRadius: '5px',
  transition: 'all 0.1s ease-in',
  pointerEvents: 'none',
});
export const cardStyles = Object.freeze({
  fontFamily: 'Arial, Helvetica, sans-serif',
  padding: '5px 8px',
  borderRadius: '4px',
  textAlign: 'left',
  position: 'absolute',
  left: 0,
  color: '#e9e9e9',
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: '24px',
  backgroundColor: '#42B8B5FF',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
});

export const indicatorStyles = Object.freeze({
  display: 'inline-block',
  fontWeight: 400,
  fontStyle: 'normal',
  fontSize: '12px',
  opacity: 0.7,
});

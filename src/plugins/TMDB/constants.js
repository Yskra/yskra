export const DOCUMENTATION_HREF = 'https://developers.themoviedb.org/3/getting-started/introduction';

export const imageTypes = Object.freeze({
  BACKDROP: 0,
  LOGO: 1,
  POSTER: 2,
  PROFILE: 3,
});

export const imageQualities = Object.freeze({
  POOR: 0,
  AVERAGE: 1,
  HIGH: 2,
});

export const imageSizes = Object.freeze({
  [imageTypes.BACKDROP]: {
    [imageQualities.POOR]: 300,
    [imageQualities.AVERAGE]: 780,
    [imageQualities.HIGH]: 1280,
  },
  [imageTypes.LOGO]: {
    [imageQualities.POOR]: 45,
    [imageQualities.AVERAGE]: 154,
    [imageQualities.HIGH]: 300,
  },
  [imageTypes.POSTER]: {
    [imageQualities.POOR]: 92,
    [imageQualities.AVERAGE]: 185,
    [imageQualities.HIGH]: 500,
  },
  [imageTypes.PROFILE]: {
    [imageQualities.POOR]: 45,
    [imageQualities.AVERAGE]: 185,
    [imageQualities.HIGH]: 185, // bcs 632 has prefix "h", not "w"
  },
});

export const IMPERIAL_METRIC_CERTIFICATION_MAP = Object.freeze({
  'G': '3+',
  'PG': '6+',
  'PG-13': '13+',
  'R': '17+',
  'NC-17': '18+',
  'TV-Y': '0+',
  'TV-Y7': '7+',
  'TV-G': '3+',
  'TV-PG': '6+',
  'TV-14': '14+',
  'TV-MA': '17+',
});

export const IMPERIAL_CERTIFICATION_REGION_KEY = 'US';

export const VIDEOS_ALT_LANGUAGE = 'en';

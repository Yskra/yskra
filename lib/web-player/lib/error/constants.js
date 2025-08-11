export const ErrorType = Object.freeze({
  UNKNOWN: 0,
  UNSUPPORTED: 1 << 0,
  PLAYER: 1 << 1,
  CREATE_PLAYER: 1 << 2,
  NETWORK: 1 << 3,
  VALIDATION: 1 << 4,
  SOURCE: 1 << 5,
  PLAYBACK: 1 << 6,
});

export const ErrorType2Code = Object.fromEntries(
  Object.entries(ErrorType).map(([key, value]) => [value, key]),
);

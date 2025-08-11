import { describe, expect, it } from 'vitest';
import Base64 from '../Base64';

describe('unicode2base64', () => {
  it('should convert Unicode text to base64', () => {
    const unicodeText = 'Hello, 世界!';
    const expectedBase64 = 'SGVsbG8sIOS4lueVjCE=';

    expect(Base64.unicode2base64(unicodeText)).toEqual(expectedBase64);
  });
});

describe('bytes2base64', () => {
  it('should convert bytes to base64', () => {
    const bytes = new Uint8Array([72, 101, 108, 108, 111]); // Equivalent to 'Hello' in ASCII
    const expectedBase64 = 'SGVsbG8=';

    expect(Base64.bytes2base64(bytes)).toEqual(expectedBase64);
  });
});

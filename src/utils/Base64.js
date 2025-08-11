export default class Base64 {
  /**
   * @param {string} text - str with Unicode
   * @return {string} - str in base64
   */
  static unicode2base64(text) {
    return Base64.bytes2base64(new TextEncoder().encode(text));
  }

  /**
   * @param {Uint8Array} bytes bytes
   * @return {string}
   */
  static bytes2base64(bytes) {
    const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join('');

    return btoa(binString);
  }
}

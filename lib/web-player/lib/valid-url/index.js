/**
 * @param {string} string
 * @return {boolean}
 */
export default function validUrl(string) {
  let url;

  try {
    url = new URL(string);
  }
  catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

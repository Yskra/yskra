// https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types/Common_types
import LibraryError, { ErrorType } from '../error';

export const FATAL_TYPE = 'application/octet-stream';

/**
 * @param {string | URL} url
 * @return {Promise<string>}
 */
export default async function getMimeType(url) {
  let response;

  try {
    response = await fetch(url, { method: 'HEAD' });
  }
  catch (error) {
    throw new LibraryError(`Network error or CORS: ${error}`, ErrorType.NETWORK);
  }

  if (response.ok) {
    return response.headers.get('content-type') ?? FATAL_TYPE;
  }
  else {
    throw new LibraryError(`Head request failed. Code: ${response.status}`, ErrorType.NETWORK);
  }
}

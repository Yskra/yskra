// @ts-nocheck
/* eslint-disable jsdoc/no-undefined-types */

export function applyRemoveApis() {
  const localStorage = window.localStorage;
  const open = window.open;
  const serviceWorker = window.navigator.serviceWorker;
  const mediaDevices = window.navigator.mediaDevices;
  const _eval = window.eval;

  delete window.localStorage;
  delete window.open;
  delete window.navigator.serviceWorker;
  delete window.navigator.geolocation;
  delete window.navigator.mediaDevices;
  delete window.eval;

  return {
    localStorage,
    open,
    serviceWorker,
    mediaDevices,
    eval: _eval,
  };
}

export function applyFreezePrototypes() {
  Object.freeze(Object.prototype);
  Object.freeze(Array.prototype);
}

/**
 * @param {Readonly<Set<string>>} blacklist black list
 */
export function applyBlockElements(blacklist) {
  const origCreateElement = document.createElement;

  /**
   * @param {string} tagName name of element
   * @param {ElementCreationOptions} args createElement apply something arguments
   * @returns {HTMLElement} absolutely normal new element
   */
  function newCreateElement(tagName, ...args) {
    if (blacklist.has(tagName.toLowerCase())) {
      return null;
    }
    if (tagName.toLowerCase() === 'iframe') {
      /** @type {HTMLIFrameElement} */
      const iframe = origCreateElement.call(this, 'iframe', ...args);
      const sandbox = 'allow-scripts allow-forms allow-same-origin';

      iframe.setAttribute('sandbox', sandbox);
      Object.defineProperty(iframe, 'sandbox', {
        get: () => sandbox,
        set() {
          throw new Error('nope');
        },
      });

      return iframe;
    }
    return origCreateElement.call(this, tagName, ...args);
  }

  delete document.createElement;
  Object.defineProperty(document, 'createElement', { value: newCreateElement });

  return {
    createElement: origCreateElement.bind(document),
  };
}

/**
 * @param {Readonly<Set<URL['href']>>} blacklist 'href' from URL constructor for corrected built after parsed
 */
export function applyBlockNetwork(blacklist) {
  const origFetch = window.fetch;
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const origXHRSend = XMLHttpRequest.prototype.send;
  const webSocket = window.WebSocket;
  const RTCPeerConnection = window.RTCPeerConnection;

  /**
   * @param {RequestInfo|URL} input fetch url
   * @param {RequestInit} init options
   * @returns {Promise<Response>} absolutely normal fetch
   */
  async function newFetch(input, init) {
    const url = input instanceof URL ? input : new URL(input instanceof Request ? input.url : input, window.location.href);

    if (blacklist.has(url.href.toLowerCase())) {
      return new Response(new ReadableStream(), { status: 403, statusText: '', headers: new Headers() });
    }
    return origFetch(url, init);
  }

  /**
   * @param {string} method request method
   * @param {string|URL} url request url
   * @param {[boolean, string|null, string|null]} args request arguments
   * @this {XMLHttpRequest}
   * @returns {void}
   */
  function newXHROpen(method, url, ...args) {
    this._url = url instanceof URL ? url : new URL(url, window.location.href);
    originalXHROpen.call(this, method, url, ...args);
  }

  /**
   * @param {XMLHttpRequestBodyInit} body request body
   * @this {XMLHttpRequest}
   * @returns {void}
   */
  function newXHRSend(body) {
    if (blacklist.has(this._url.href.toLowerCase())) {
      this.abort();
      if (typeof this.onreadystatechange === 'function') {
        this.onreadystatechange(new Event('readystatechange'));
      }
    }
    else {
      origXHRSend.call(this, body);
    }

    delete this._url;
  }

  delete XMLHttpRequest.prototype.open;
  delete XMLHttpRequest.prototype.send;

  // oxlint-disable-next-line no-extend-native
  Object.defineProperties(XMLHttpRequest.prototype, {
    open: { value: newXHROpen },
    send: { value: newXHRSend },
  });

  delete window.fetch;
  Object.defineProperty(window, 'fetch', { value: newFetch });

  delete window.RTCPeerConnection;
  delete window.webkitRTCPeerConnection;
  delete window.WebSocket;

  return {
    fetch: origFetch.bind(window),
    RTCPeerConnection,
    WebSocket: webSocket,
    XHRSend: origXHRSend.bind(XMLHttpRequest.prototype),
  };
}

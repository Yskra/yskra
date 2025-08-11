import SupportedAPI from '@/utils/SupportedAPI.js';

/** @typedef {new (options?: {name?: string | undefined;} | undefined) => Worker} ViteWorker */

/**
 * Create controller for parallel function execution with WebWorkers or WASM with Promise interface.
 * Can accept a worker from Vite, URL to worker or WASM url, priority will be given to WASM if there is support
 * Creates singleton only on first access
 * @template T
 * @param {object} options options
 * @param {URL|string=} options.workerUrl URL to worker
 * @param {ViteWorker=} options.Worker like: import myWorker from '/path/to/something.js?worker'
 * @param {URL|string=} options.wasmUrl URL to wasm
 * @returns {(...args: unknown[]) => Promise<T>} controller
 */
export default function createThreadProcessor({ Worker: ViteWorker, workerUrl, wasmUrl }) {
  /** @type {Worker} */
  let workerInstance;
  // counter for generate order id
  let counter = 0;

  if (SupportedAPI.WASM && wasmUrl) {
    return (/** @type {unknown[]} */ ...args) => processWASM(args);
  }
  else if (SupportedAPI.webWorkers && (ViteWorker || workerUrl)) {
    return (/** @type {unknown[]} */ ...args) => processWebWorker(args);
  }
  else {
    throw new Error('Neither Web Workers nor WASM is supported in environment');
  }

  /**
   * @param {unknown[]} args args for function
   * @returns {Promise<T>} result of function
   */
  function processWebWorker(args) {
    const id = counter++;

    if (!workerInstance) {
      if (ViteWorker) {
        workerInstance = new ViteWorker();
      }
      else if (workerUrl) {
        workerInstance = new Worker(workerUrl);
      }
    }

    return new Promise((resolve, reject) => {
      /**
       * @param {MessageEvent} event event
       */
      const messageHandler = (event) => {
        if (event?.data?.id === id) {
          if (event.data.error) {
            reject(new Error(event.data.error));
          }
          else {
            resolve(event.data.return);
          }
          workerInstance.removeEventListener('message', messageHandler);
        }
      };

      workerInstance.addEventListener('message', messageHandler);
      workerInstance.postMessage({ id, args });
    });
  }


  /**
   * @param {unknown[]} args args for function
   * @returns {Promise<T>} result of function
   */
  function processWASM(...args) {
    // todo: implement
    return new Promise(() => args);
  }
}

// @ts-nocheck
/* eslint-disable no-undef */
/* oxlint-disable no-restricted-globals, no-undef, jsdoc/require-param */


/**
 * Wrapper to create function to run on WebWorker and work with threadProcessor message format
 * handle args, returns and errors
 * @param {Function} func execute function
 */
export default function makeWorker(func) {
  const isRunningInWorker = typeof Window === 'undefined' && self instanceof WorkerGlobalScope;

  if (!isRunningInWorker) {
    throw new Error('This function can be used only in worker');
  }

  self.onmessage = async (event) => {
    const { id, args } = event.data;

    try {
      const result = await func(...args);

      self.postMessage({
        id,
        return: result,
      });
    }
    catch (error) {
      self.postMessage({
        id,
        error: error.message || 'An error occurred',
      });
    }
  };
}

export default function createManualThenable() {
  /** @type {((arg0: any) => void) | null | undefined} */
  let onResolve = null;
  /** @type {((arg0: any) => void) | null} */
  let onReject = null;
  /** @type {'pending' | 'fulfilled' | 'rejected'} */
  let state = 'pending';
  /** @type {any} */
  let value = null;
  /** @type {any} */
  let error = null;

  const thenable = {
    /**
     * @param {((arg0: any) => void) | undefined} onFulfilled
     * @param {(arg0: any) => void} onRejected
     */
    then(onFulfilled, onRejected = () => {}) {
      if (state === 'fulfilled') {
        onFulfilled?.(value);
      }
      else if (state === 'rejected') {
        onRejected(error);
      }
      else {
        onResolve = onFulfilled;
        onReject = onRejected;
      }
      return this;
    },
    /**
     * @param {(arg0: any) => void} onRejected
     */
    catch(onRejected) {
      return this.then(undefined, onRejected);
    },
  };

  return {
    thenable,
    /**
     * @param {any=} val
     */
    resolve(val) {
      if (state !== 'pending')
        return;
      state = 'fulfilled';
      value = val;
      if (onResolve)
        onResolve(val);
    },
    /**
     * @param {any=} err
     */
    reject(err) {
      if (state !== 'pending')
        return;
      state = 'rejected';
      error = err;
      if (onReject)
        onReject(err);
    },
  };
}

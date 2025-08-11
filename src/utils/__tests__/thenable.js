import { expect, it } from 'vitest';
import createManualThenable from '../thenable';

it('should create a thenable object with initial pending state', () => {
  const { thenable } = createManualThenable();

  expect(thenable).toBeDefined();
  expect(typeof thenable.then).toBe('function');
  expect(typeof thenable.catch).toBe('function');
});

it('should resolve promise and call onFulfilled callback', () => {
  const { thenable, resolve } = createManualThenable();
  let resolvedValue = null;

  thenable.then((value) => {
    resolvedValue = value;
  });

  resolve('test-value');
  expect(resolvedValue).toBe('test-value');
});

it('should reject promise and call onRejected callback', () => {
  const { thenable, reject } = createManualThenable();
  let rejectedError = null;

  thenable.then(
    () => {},
    (error) => {
      rejectedError = error;
    },
  );

  reject('test-error');
  expect(rejectedError).toBe('test-error');
});

it('should call onFulfilled immediately if already resolved', () => {
  const { thenable, resolve } = createManualThenable();
  let resolvedValue = null;

  resolve('already-resolved');

  thenable.then((value) => {
    resolvedValue = value;
  });

  expect(resolvedValue).toBe('already-resolved');
});

it('should call onRejected immediately if already rejected', () => {
  const { thenable, reject } = createManualThenable();
  let rejectedError = null;

  reject('already-rejected');

  thenable.then(
    () => {},
    (error) => {
      rejectedError = error;
    },
  );

  expect(rejectedError).toBe('already-rejected');
});

it('should support catch method for error handling', () => {
  const { thenable, reject } = createManualThenable();
  let caughtError = null;

  thenable.catch((error) => {
    caughtError = error;
  });

  reject('catch-test-error');
  expect(caughtError).toBe('catch-test-error');
});

it('should handle undefined callbacks', () => {
  const { thenable, reject } = createManualThenable();
  let finalValue = null;
  let finalError = null;

  // Test with undefined onFulfilled
  thenable.then(undefined, (error) => {
    finalError = error;
  });

  reject('test-error');
  expect(finalError).toBe('test-error');

  // Test with undefined onRejected
  const { thenable: thenable2, resolve: resolve2 } = createManualThenable();

  thenable2.then((value) => {
    finalValue = value;
  }, undefined);

  resolve2('test-value');
  expect(finalValue).toBe('test-value');
});

it('should handle resolve with undefined value', () => {
  const { thenable, resolve } = createManualThenable();
  let resolvedValue = null;

  thenable.then((value) => {
    resolvedValue = value;
  });

  resolve();
  expect(resolvedValue).toBeUndefined();
});

it('should handle reject with undefined error', () => {
  const { thenable, reject } = createManualThenable();
  let rejectedError = null;

  thenable.then(undefined, (error) => {
    rejectedError = error;
  });

  reject();
  expect(rejectedError).toBeUndefined();
});

it('should not call callbacks after state change', () => {
  const { thenable, resolve, reject } = createManualThenable();
  let callCount = 0;

  const callback = () => {
    callCount++;
  };

  thenable.then(callback, callback);
  resolve('test');

  reject('error');
  expect(callCount).toBe(1);
});

it('should handle null and falsy values correctly', () => {
  const { thenable, resolve } = createManualThenable();
  let resolvedValue = null;
  let rejectedError = null;

  thenable.then(
    (value) => { resolvedValue = value; },
    (error) => { rejectedError = error; },
  );

  resolve(null);
  expect(resolvedValue).toBeNull();

  const { thenable: thenable2, reject: reject2 } = createManualThenable();

  thenable2.then(
    () => {},
    (error) => { rejectedError = error; },
  );

  reject2(0);
  expect(rejectedError).toBe(0);
});

it('should return the same thenable instance for chaining', () => {
  const { thenable } = createManualThenable();
  const returnedThenable = thenable.then(() => {}, () => {});

  expect(returnedThenable).toBe(thenable);
});

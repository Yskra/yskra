/** @import {Ref} from 'vue' */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import { useTitle } from '../title.js';

describe('useTitle', () => {
  /** @type {Document} */
  let mockDocument;

  beforeEach(() => {
    // @ts-ignore
    mockDocument = {
      title: 'Initial Title',
    };

    vi.stubGlobal('document', mockDocument);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should set document title immediately with string value', () => {
    const titleRef = ref('New Title');

    useTitle(titleRef);

    expect(mockDocument.title).toBe('New Title');
  });

  it('should use default document title when no title provided', () => {
    // @ts-ignore
    useTitle();
    expect(mockDocument.title).toBe('Initial Title');
  });

  it('should update document title when ref value changes', async () => {
    const titleRef = ref('Initial');

    useTitle(titleRef);

    expect(mockDocument.title).toBe('Initial');

    titleRef.value = 'Updated';
    await nextTick();

    expect(mockDocument.title).toBe('Updated');
  });

  it('should format title with string template', () => {
    const titleRef = ref('Page Name');

    useTitle(titleRef, { titleTemplate: '%s - My Site' });

    expect(mockDocument.title).toBe('Page Name - My Site');
  });

  it('should format title with function template', () => {
    const titleRef = ref('Home');
    const templateFn = (/** @type {any} */ title) => `${title} | My Application`;

    useTitle(titleRef, { titleTemplate: templateFn });

    expect(mockDocument.title).toBe('Home | My Application');
  });

  // it('should stop watching when component unmounts', async () => {
  //   const titleRef = ref('Initial');
  //
  //   useTitle(titleRef);
  //
  //   expect(global.onBeforeUnmount).toHaveBeenCalled();
  //
  //   const unmountCallback = global.onBeforeUnmount.mock.calls[0][0];
  //
  //   unmountCallback();
  //
  //   titleRef.value = 'Should Not Update';
  //   await nextTick();
  //
  //   expect(mockDocument.title).toBe('Initial');
  // });
  //
  // it('should pause and resume watching when component deactivated and activated', async () => {
  //   const titleRef = ref('Active Title');
  //
  //   useTitle(titleRef);
  //
  //   expect(global.onDeactivated).toHaveBeenCalled();
  //   expect(global.onActivated).toHaveBeenCalled();
  //
  //   const deactivateCallback = global.onDeactivated.mock.calls[0][0];
  //   const activateCallback = global.onActivated.mock.calls[0][0];
  //
  //   deactivateCallback();
  //
  //   titleRef.value = 'Inactive Title';
  //   await nextTick();
  //
  //   expect(mockDocument.title).toBe('Active Title');
  //
  //   activateCallback();
  //
  //   titleRef.value = 'Reactivated Title';
  //   await nextTick();
  //
  //   expect(mockDocument.title).toBe('Reactivated Title');
  // });

  it('should handle null values', async () => {
    /** @type {Ref<string|null>} */
    const titleRef = ref('Initial');

    useTitle(titleRef);

    titleRef.value = null;
    await nextTick();

    expect(mockDocument.title).toBe('');
  });

  it('should not update title when value is the same', async () => {
    const titleRef = ref('Same Title');

    useTitle(titleRef);

    const originalTitle = mockDocument.title;

    titleRef.value = 'Same Title';
    await nextTick();

    expect(mockDocument.title).toBe(originalTitle);
  });

  it('should handle empty title with template', () => {
    const titleRef = ref('');

    useTitle(titleRef, { titleTemplate: '%s - Site' });

    expect(mockDocument.title).toBe(' - Site');
  });

  // it('should handle non-string values by converting to string', async () => {
  //   const titleRef = ref(42);
  //
  //   useTitle(titleRef);
  //
  //   expect(mockDocument.title).toBe('42');
  //
  //   titleRef.value = true;
  //   await nextTick();
  //
  //   expect(mockDocument.title).toBe('true');
  // });

  it('should return a ref that reflects current title', () => {
    const titleRef = ref('Readable Title');
    const returnedRef = useTitle(titleRef);

    expect(returnedRef.value).toBe('Readable Title');
  });

  it('should handle template function', () => {
    const titleRef = ref('Home');
    const templateFn = (/** @type {any} */ title) => `App - ${title}`;

    useTitle(titleRef, { titleTemplate: templateFn });

    expect(mockDocument.title).toBe('App - Home');
  });
});

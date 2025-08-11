import { expect, it } from 'vitest';
import { ref } from 'vue';
import { useDialog } from '../dialog.js';

it('should initialize with default closed state', () => {
  const dialog = useDialog();

  expect(dialog.isOpened.value).toBe(false);
});

it('should initialize with provided ref state', () => {
  const openRef = ref(true);
  const dialog = useDialog(openRef);

  expect(dialog.isOpened.value).toBe(true);
});

it('should initialize with provided boolean value', () => {
  const dialog = useDialog(true);

  expect(dialog.isOpened.value).toBe(true);
});

it('should open dialog with reveal method', async () => {
  const dialog = useDialog();

  await dialog.reveal();
  expect(dialog.isOpened.value).toBe(true);
});

it('should close dialog with close method', () => {
  const openRef = ref(true);
  const dialog = useDialog(openRef);

  dialog.close();
  expect(dialog.isOpened.value).toBe(false);
});

it('should trigger close hook when dialog is closed', () => {
  const dialog = useDialog();
  let closeData = null;

  dialog.onClose((data) => {
    closeData = data;
  });

  const testData = { reason: 'cancel' };

  dialog.close(testData);

  expect(closeData).toEqual(testData);
});

it('should update external ref when dialog state changes', async () => {
  const openRef = ref(false);
  const dialog = useDialog(openRef);

  await dialog.reveal();
  expect(openRef.value).toBe(true);

  dialog.close();
  expect(openRef.value).toBe(false);
});

it('should handle multiple close listeners', () => {
  const dialog = useDialog();
  let callCount = 0;
  const testData = 'test';

  dialog.onClose(() => callCount++);
  dialog.onClose(() => callCount++);

  dialog.close(testData);

  expect(callCount).toBe(2);
});

it('should pass undefined data to close hook when no data provided', () => {
  const dialog = useDialog();
  let receivedData;

  dialog.onClose((data) => {
    receivedData = data;
  });

  dialog.close();

  expect(receivedData).toBeUndefined();
});

it('should handle reveal as async function', async () => {
  const dialog = useDialog();
  const promise = dialog.reveal();

  expect(promise instanceof Promise).toBe(true);

  await promise;
  expect(dialog.isOpened.value).toBe(true);
});

it('should maintain reactive isOpened ref', async () => {
  const dialog = useDialog();

  expect(dialog.isOpened.value).toBe(false);

  await dialog.reveal();
  expect(dialog.isOpened.value).toBe(true);

  dialog.close();
  expect(dialog.isOpened.value).toBe(false);
});

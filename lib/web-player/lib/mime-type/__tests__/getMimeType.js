import { expect, it, vi } from 'vitest';
import getMimeType from '..';

it('returns correct MIME type when response is OK', async () => {
  const fetch = vi.fn(() => Promise.resolve({
    ok: true,
    headers: {
      get: () => 'text/plain',
    },
  }));

  vi.stubGlobal('fetch', fetch);

  const mimeType = await getMimeType('https://example.com');

  expect(mimeType).toBe('text/plain');
});

it('returns FATAL_TYPE when response is not OK', async () => {
  const fetch = vi.fn(() => Promise.resolve({
    ok: false,
    status: 404,
  }));

  vi.stubGlobal('fetch', fetch);

  const mimeType = await getMimeType('https://example.com');

  expect(mimeType).toBe('application/octet-stream');
});

it('returns FATAL_TYPE when there is a network error', async () => {
  const fetch = vi.fn(() => Promise.reject(new Error('Network error')));

  vi.stubGlobal('fetch', fetch);
  const mimeType = await getMimeType('https://example.com');

  expect(mimeType).toBe('application/octet-stream');
});

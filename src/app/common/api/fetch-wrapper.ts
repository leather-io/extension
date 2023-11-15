import axios from 'axios';

import { HIRO_API_KEY } from '@shared/constants';

const leatherHeaders: HeadersInit = {
  'x-leather-version': VERSION,
  'x-hiro-api-key': HIRO_API_KEY,
};

/**
 * @deprecated Use `axios` directly instead
 */
export function wrappedFetch(input: RequestInfo, init: RequestInit = {}) {
  const initHeaders = init.headers || {};
  // eslint-disable-next-line no-restricted-globals
  return fetch(input, {
    credentials: 'omit',
    ...init,
    headers: { ...initHeaders, ...leatherHeaders },
  });
}

export async function fetchWithTimeout(
  input: RequestInfo,
  init: RequestInit & { timeout?: number } = {}
) {
  const { timeout = 8000, ...options } = init;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await wrappedFetch(input, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);

  return response;
}

axios.interceptors.request.use(config => {
  if (config.url?.includes('hiro.so')) config.headers['x-hiro-api-key'] = HIRO_API_KEY;
  return config;
});

import { X_API_KEY } from '@shared/constants';

const hiroHeaders: HeadersInit = {
  'x-api-key': X_API_KEY,
  'x-hiro-product': 'stacks-wallet-web',
  'x-hiro-version': VERSION,
};

export function fetcher(input: RequestInfo, init: RequestInit = {}) {
  const initHeaders = init.headers || {};
  return fetch(input, {
    credentials: 'omit',
    ...init,
    headers: { ...initHeaders, ...hiroHeaders },
  });
}

export async function fetchWithTimeout(
  input: RequestInfo,
  init: RequestInit & { timeout?: number } = {}
) {
  const { timeout = 8000, ...options } = init;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetcher(input, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);

  return response;
}

import { stacksClient } from '@leather.io/query';

import { useLeatherNetwork } from '../leather-query-provider';

export function useStacksClient() {
  const network = useLeatherNetwork();
  return stacksClient(network.chain.stacks.url);
}

export async function hiroFetchWrapper(input: RequestInfo | URL, init?: RequestInit) {
  const url =
    typeof input === 'string' || input instanceof URL
      ? new URL(input.toString())
      : new URL(input.url);

  const headers = new Headers(
    init?.headers || (input instanceof Request ? input.headers : undefined)
  );

  // Supports hiro.so including subdomains
  if (url.hostname.endsWith('hiro.so')) headers.set('X-Partner', 'Leather');

  // Use the modified headers in the final init object
  const finalInit = { ...init, headers } as const;

  // eslint-disable-next-line no-restricted-globals
  return fetch(input, finalInit);
}

import { TransactionPayload } from '@stacks/connect';
import { StacksNetwork } from '@stacks/network';
import { decodeToken } from 'jsontokens';

// We need this function because the latest changes
// to `@stacks/network` had some undesired consequence.
// As `StacksNetwork` is a class instance, this is auto
// serialized when being passed across `postMessage`,
// from the developer's app, to Leather.
// `coreApiUrl` now uses a getter, rather than a prop,
// and `_coreApiUrl` is a private value.
// To support both `@stacks/network` versions a dev may be using
// we look for both possible networks defined
export function getCoreApiUrl(network: Pick<StacksNetwork, 'coreApiUrl'>): string {
  if (network.coreApiUrl) return network.coreApiUrl;
  if ((network as any)._coreApiUrl) return (network as any)._coreApiUrl;
  return '';
}

export function getPayloadFromToken(requestToken: string) {
  const token = decodeToken(requestToken);
  return token.payload as unknown as TransactionPayload;
}

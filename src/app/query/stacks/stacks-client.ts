import { stacksClient } from '@leather.io/query';

import { useLeatherNetwork } from '../leather-query-provider';

export function useStacksClient() {
  const network = useLeatherNetwork();
  return stacksClient(network.chain.stacks.url);
}

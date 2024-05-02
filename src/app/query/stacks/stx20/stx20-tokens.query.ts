import { ChainID } from '@stacks/transactions';
import { useQuery } from '@tanstack/react-query';

import { AppUseQueryConfig } from '@app/query/query-config';
import { useStacksClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import type { Stx20Balance } from '../stacks-client';

export function useStx20BalancesQuery<T extends unknown = Stx20Balance[]>(
  address: string,
  options?: AppUseQueryConfig<Stx20Balance[], T>
) {
  const client = useStacksClient();
  const network = useCurrentNetwork();

  return useQuery({
    enabled: network.chain.stacks.chainId === ChainID.Mainnet,
    queryKey: ['stx20-balances', address],
    queryFn: () => client.stx20Api.getStx20Balances(address),
    ...options,
  });
}

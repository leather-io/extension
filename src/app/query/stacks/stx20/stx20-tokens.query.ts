import { ChainID } from '@stacks/transactions';
import { useQuery } from '@tanstack/react-query';

import * as stx20Service from '@app/api/stacks/services/stx20-service';
import { AppUseQueryConfig } from '@app/query/query-config';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

type FetchStx20BalancesResp = Awaited<ReturnType<typeof stx20Service.fetchStx20Balances>>;

export function useStx20BalancesQuery<T extends unknown = FetchStx20BalancesResp>(
  address: string,
  options?: AppUseQueryConfig<FetchStx20BalancesResp, T>
) {
  const network = useCurrentNetwork();

  return useQuery({
    enabled: network.chain.stacks.chainId === ChainID.Mainnet,
    queryKey: ['stx20-balances', address],
    queryFn: () => stx20Service.fetchStx20Balances(address),
    ...options,
  });
}

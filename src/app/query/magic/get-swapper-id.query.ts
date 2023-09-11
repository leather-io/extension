import { useQuery } from '@tanstack/react-query';

import { getMagicContracts } from '@app/common/magic/client';
import { useMagicClient } from '@app/common/magic/hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { AppUseQueryConfig } from '../query-config';
import { MagicQueryKeys } from './constants';

export function useGetSwapperIdQuery<TResponse>(
  address: string,
  options?: AppUseQueryConfig<bigint | null, TResponse> & { enabled: boolean }
) {
  const client = useMagicClient();
  const network = useCurrentNetworkState();

  const contracts = getMagicContracts(network.id);

  return useQuery({
    queryKey: [MagicQueryKeys.GetSwapperId, address],
    queryFn: async () => await client.ro(contracts.bridge.getSwapperId(address)),
    ...options,
  });
}

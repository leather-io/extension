import { useQuery } from '@tanstack/react-query';

import { getMagicContracts } from '@app/common/magic';
import { useMagicClient } from '@app/common/magic/hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { AppUseQueryConfig } from '../query-config';
import { MagicQueryKeys } from './constants';

export function useGetSwapperIdQuery(
  address: string,
  options?: AppUseQueryConfig<bigint | undefined, bigint | undefined>
) {
  const client = useMagicClient();
  const network = useCurrentNetworkState();

  const contracts = getMagicContracts(network.id);

  return useQuery({
    queryKey: [MagicQueryKeys.GetSwapperId, address],
    queryFn: async () => (await client.ro(contracts.bridge.getSwapperId(address))) || undefined,
    ...options,
  });
}

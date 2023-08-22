import { hexToBytes } from '@stacks/common';
import { useQuery } from '@tanstack/react-query';

import { getMagicContracts } from '@app/common/magic';
import { useMagicClient } from '@app/common/magic/hooks';
import { MagicInboundSwap } from '@app/common/magic/models';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { AppUseQueryConfig } from '../query-config';
import { MagicQueryKeys } from './constants';

export function useGetInboundSwapQuery<TResponse = MagicInboundSwap>(
  transactionId: string,
  options?: AppUseQueryConfig<MagicInboundSwap | undefined, TResponse | undefined>
) {
  const client = useMagicClient();
  const network = useCurrentNetworkState();

  const contracts = getMagicContracts(network.id);

  return useQuery({
    queryKey: [MagicQueryKeys.GetSwapperId, transactionId],
    queryFn: async () =>
      (await client.ro(contracts.bridge.getInboundSwap(hexToBytes(transactionId)))) || undefined,
    ...options,
  });
}

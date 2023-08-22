import { useQuery } from '@tanstack/react-query';

import { getMagicContracts } from '@app/common/magic';
import { fetchSupplier } from '@app/common/magic/fetch/fetch-supplier';
import { useMagicClient } from '@app/common/magic/hooks';
import { MagicSupplier } from '@app/common/magic/models';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { AppUseQueryConfig } from '../query-config';
import { MagicQueryKeys } from './constants';

export function useGetSupplierQuery<TResponse = MagicSupplier>(
  id: number,
  options?: AppUseQueryConfig<MagicSupplier | undefined, TResponse | undefined>
) {
  const client = useMagicClient();
  const network = useCurrentNetworkState();

  const contracts = getMagicContracts(network.id);

  return useQuery({
    queryKey: [MagicQueryKeys.GetSupplier, id],
    queryFn: () => fetchSupplier(id, client, contracts),
    ...options,
  });
}

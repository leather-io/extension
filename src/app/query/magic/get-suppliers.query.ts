import { useQuery } from '@tanstack/react-query';

import { useElectrumClient } from '@app/common/electrum/hooks';
import { getMagicContracts } from '@app/common/magic';
import { fetchSupplierWithCapacity } from '@app/common/magic/fetch';
import { useMagicClient } from '@app/common/magic/hooks';
import type { MagicSupplierWithCapacity } from '@app/common/magic/models';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import type { AppUseQueryConfig } from '../query-config';
import { MagicQueryKeys } from './constants';

export function useGetSuppliersQuery<TResponse = MagicSupplierWithCapacity[]>(
  options?: AppUseQueryConfig<MagicSupplierWithCapacity[], TResponse>
) {
  const network = useCurrentNetworkState();

  const magicClient = useMagicClient();
  const magicContracts = getMagicContracts(network.id);

  const { withElectrumClient } = useElectrumClient();

  return useQuery({
    queryKey: [MagicQueryKeys.GetSuppliers],
    queryFn: () =>
      withElectrumClient(async electrumClient => {
        const nextId = await magicClient.ro(magicContracts.bridge.getNextSupplierId());
        const fetchSuppliers: Promise<MagicSupplierWithCapacity>[] = [];

        for (let id = 0; id < nextId; id++) {
          fetchSuppliers.push(
            fetchSupplierWithCapacity(id, {
              network: network.id,
              electrumClient,
              magicContracts,
              magicClient,
            })
          );
        }

        const suppliers = await Promise.all(fetchSuppliers);

        return suppliers;
      }),
    ...options,
  });
}

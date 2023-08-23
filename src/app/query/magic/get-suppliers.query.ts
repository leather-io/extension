import { useQuery } from '@tanstack/react-query';

import { getMagicContracts } from '@app/common/magic';
import { useMagicClient } from '@app/common/magic/hooks';
import { useElectrumClient } from '@app/common/electrum/hooks';
import { fetchSupplierWithCapacity } from '@app/common/magic/fetch';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { MagicQueryKeys } from './constants';

import type { MagicSupplierWithCapacity } from '@app/common/magic/models';

import type { AppUseQueryConfig } from '../query-config';

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

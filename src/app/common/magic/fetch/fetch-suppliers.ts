import { fetchSupplierWithCapacity } from '@app/common/magic/fetch';

import { MagicSupplierWithCapacity } from '../models';
import { MagicFetchContextWithElectrum } from './constants';

export async function fetchSuppliers({
  network,
  magicClient,
  magicContracts,
  electrumClient,
}: MagicFetchContextWithElectrum): Promise<MagicSupplierWithCapacity[]> {
  const nextId = await magicClient.ro(magicContracts.bridge.getNextSupplierId());
  const fetchSuppliers: Promise<MagicSupplierWithCapacity>[] = [];

  for (let id = 0; id < nextId; id++) {
    fetchSuppliers.push(
      fetchSupplierWithCapacity(id, {
        network,
        electrumClient,
        magicContracts,
        magicClient,
      })
    );
  }

  return await Promise.all(fetchSuppliers);
}

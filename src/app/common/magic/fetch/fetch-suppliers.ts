import { fetchSupplierWithCapacity } from '@app/common/magic/fetch';

import { MagicSupplierWithCapacity } from '../models';
import { MagicFetchContextWithBitcoin } from './constants';

export async function fetchSuppliers(context: MagicFetchContextWithBitcoin): Promise<MagicSupplierWithCapacity[]> {
  const { magicClient, magicContracts } = context;

  const nextId = await magicClient.ro(magicContracts.bridge.getNextSupplierId());
  const fetchSuppliers: Promise<MagicSupplierWithCapacity>[] = [];

  for (let id = 0; id < nextId; id++) {
    fetchSuppliers.push(
      fetchSupplierWithCapacity(id, context)
    );
  }

  return await Promise.all(fetchSuppliers);
}

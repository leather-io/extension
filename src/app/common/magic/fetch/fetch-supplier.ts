import { bytesToHex } from '@stacks/common';

import type { MagicSupplier } from '../models';
import type { MagicFetchContext } from './constants';

export async function fetchSupplier(
  id: number,
  { magicClient: clarigen, magicContracts: magic }: MagicFetchContext
) {
  const [supplier, funds] = await Promise.all([
    clarigen.ro(magic.bridge.getSupplier(id)),
    clarigen.ro(magic.bridge.getFunds(id)),
  ]);

  if (supplier && funds !== null) {
    return {
      controller: supplier.controller,
      inboundFee: Number(supplier.inboundFee),
      outboundFee: Number(supplier.outboundFee),
      outboundBaseFee: Number(supplier.outboundBaseFee),
      inboundBaseFee: Number(supplier.inboundBaseFee),
      publicKey: bytesToHex(supplier.publicKey),
      funds: Number(funds),
      id,
    } as MagicSupplier;
  }

  throw new Error(`Supplier with ID ${id} could not be found.`);
}

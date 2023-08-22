import { ClarigenClient } from '@clarigen/core';
import { bytesToHex } from '@stacks/common';

import { MagicContracts } from '..';
import { MagicSupplier } from '../models';

export async function fetchSupplier(id: number, client: ClarigenClient, contracts: MagicContracts) {
  const [supplier, funds] = await Promise.all([
    client.ro(contracts.bridge.getSupplier(id)),
    client.ro(contracts.bridge.getFunds(id)),
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

  return undefined;
}

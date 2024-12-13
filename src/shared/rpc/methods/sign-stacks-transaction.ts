import { StacksNetworks } from '@stacks/network';
import { z } from 'zod';

import { formatValidationErrors, getRpcParamErrors, validateRpcParams } from './validation.utils';

const rpcSignStacksTransactionParamsSchema = z.object({
  stxAddress: z.string().optional(),
  txHex: z.string(),
  attachment: z.string().optional(),
  network: z.enum(StacksNetworks).optional(),
});

export function validateRpcSignStacksTransactionParams(obj: unknown) {
  return validateRpcParams(obj, rpcSignStacksTransactionParamsSchema);
}

export function getRpcSignStacksTransactionParamErrors(obj: unknown) {
  return formatValidationErrors(getRpcParamErrors(obj, rpcSignStacksTransactionParamsSchema));
}

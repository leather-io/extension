import { z } from 'zod';

import { WalletDefaultNetworkConfigurationIds } from '@leather.io/models';
import type { PaymentTypes } from '@leather.io/rpc';

import {
  accountSchema,
  formatValidationErrors,
  getRpcParamErrors,
  validateRpcParams,
} from './validation.utils';

const rpcSignMessageParamsSchema = z.object({
  type: z.enum(['bip322']).optional(),
  account: accountSchema.optional(),
  message: z.string(),
  network: z
    .enum(Object.values(WalletDefaultNetworkConfigurationIds) as [string, ...string[]])
    .optional(),
  paymentType: z.enum(['p2tr', 'p2wpkh'] as [PaymentTypes, PaymentTypes]).optional(),
});

export function validateRpcSignMessageParams(obj: unknown) {
  return validateRpcParams(obj, rpcSignMessageParamsSchema);
}

export function getRpcSignMessageParamErrors(obj: unknown) {
  return formatValidationErrors(getRpcParamErrors(obj, rpcSignMessageParamsSchema));
}

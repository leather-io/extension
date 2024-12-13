import { StacksNetworks } from '@stacks/network';
import { z } from 'zod';

import { formatValidationErrors, getRpcParamErrors, validateRpcParams } from './validation.utils';

const SignedMessageTypeArray = ['utf8', 'structured'] as const;

// TODO: refactor to use .discriminatedUnion
const rpcSignStacksMessageParamsSchema = z.object({
  message: z.string(),
  messageType: z.enum(SignedMessageTypeArray),
  network: z.enum(StacksNetworks).optional(),
  domain: z.string().optional(),
});

export function validateRpcSignStacksMessageParams(obj: unknown) {
  return validateRpcParams(obj, rpcSignStacksMessageParamsSchema);
}

export function getRpcSignStacksMessageParamErrors(obj: unknown) {
  return formatValidationErrors(getRpcParamErrors(obj, rpcSignStacksMessageParamsSchema));
}

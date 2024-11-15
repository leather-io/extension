import { DefineRpcMethod, RpcRequest, RpcResponse } from '@btckit/types';
import { StacksNetworks } from '@stacks/network';
import { z } from 'zod';

import { formatValidationErrors, getRpcParamErrors, validateRpcParams } from './validation.utils';

const SignedMessageTypeArray = ['utf8', 'structured'] as const;

// TODO: refactor to use .discriminatedUnion
const rpcSignStacksMessageParamsSchema = z.object({
  network: z.enum(StacksNetworks).optional(),
  message: z.string(),
  domain: z.string().optional(),
  messageType: z.enum(SignedMessageTypeArray),
});

export function validateRpcSignStacksMessageParams(obj: unknown) {
  return validateRpcParams(obj, rpcSignStacksMessageParamsSchema);
}

export function getRpcSignStacksMessageParamErrors(obj: unknown) {
  return formatValidationErrors(getRpcParamErrors(obj, rpcSignStacksMessageParamsSchema));
}

type SignStacksMessageRequestParams = z.infer<typeof rpcSignStacksMessageParamsSchema>;

export type SignStacksMessageRequest = RpcRequest<
  'stx_signMessage',
  SignStacksMessageRequestParams
>;

type SignStacksMessageResponse = RpcResponse<{ signature: string }>;

export type SignStacksMessage = DefineRpcMethod<
  SignStacksMessageRequest,
  SignStacksMessageResponse
>;

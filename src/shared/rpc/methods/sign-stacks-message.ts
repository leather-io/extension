import { DefineRpcMethod, RpcRequest, RpcResponse } from '@btckit/types';
import { StacksNetworks } from '@stacks/network';
import * as yup from 'yup';

import { formatValidationErrors, getRpcParamErrors, validateRpcParams } from './validation.utils';

const SignedMessageTypeArray = ['utf8', 'structured'] as const;

const rpcSignStacksMessageParamsSchema = yup.object().shape({
  network: yup.string().oneOf(StacksNetworks),
  message: yup.string().required(),
  domain: yup.string(),
  messageType: yup.string().oneOf(SignedMessageTypeArray).required(),
});

export function validateRpcSignStacksMessageParams(obj: unknown) {
  return validateRpcParams(obj, rpcSignStacksMessageParamsSchema);
}

export function getRpcSignStacksMessageParamErrors(obj: unknown) {
  return formatValidationErrors(getRpcParamErrors(obj, rpcSignStacksMessageParamsSchema));
}

type SignStacksMessageRequestParams = yup.InferType<typeof rpcSignStacksMessageParamsSchema>;

export type SignStacksMessageRequest = RpcRequest<
  'stx_signMessage',
  SignStacksMessageRequestParams
>;

type SignStacksMessageResponse = RpcResponse<{ signature: string }>;

export type SignStacksMessage = DefineRpcMethod<
  SignStacksMessageRequest,
  SignStacksMessageResponse
>;

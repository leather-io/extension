import { DefineRpcMethod, RpcRequest, RpcResponse } from '@btckit/types';
import { StacksNetworks } from '@stacks/network';
import * as yup from 'yup';

import { formatValidationErrors, getRpcParamErrors, validateRpcParams } from './validation.utils';

const rpcSignStacksTransactionParamsSchema = yup.object().shape({
  stxAddress: yup.string().required(),
  txHex: yup.string().required(),
  attachment: yup.string(),
  network: yup.string().oneOf(StacksNetworks),
});

export function validateRpcSignStacksTransactionParams(obj: unknown) {
  return validateRpcParams(obj, rpcSignStacksTransactionParamsSchema);
}

export function getRpcSignStacksTransactionParamErrors(obj: unknown) {
  return formatValidationErrors(getRpcParamErrors(obj, rpcSignStacksTransactionParamsSchema));
}

type SignStacksTransactionRequestParams = yup.InferType<
  typeof rpcSignStacksTransactionParamsSchema
>;

export type SignStacksTransactionRequest = RpcRequest<
  'signStacksTransaction',
  SignStacksTransactionRequestParams
>;

type SignStacksTransactionResponse = RpcResponse<{ txHex: string }>;

export type SignStacksTransaction = DefineRpcMethod<
  SignStacksTransactionRequest,
  SignStacksTransactionResponse
>;

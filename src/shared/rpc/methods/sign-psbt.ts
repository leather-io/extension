import { DefineRpcMethod, RpcRequest, RpcResponse, SignatureHash } from '@btckit/types';
import * as btc from '@scure/btc-signer';
import * as yup from 'yup';

import { WalletDefaultNetworkConfigurationIds } from '@shared/constants';

import {
  accountSchema,
  formatValidationErrors,
  getRpcParamErrors,
  testIsNumberOrArrayOfNumbers,
  validateRpcParams,
} from './validation.utils';

// TODO: Revisit allowedSighash type if/when fixed in btc-signer
export type AllowedSighashTypes = SignatureHash | btc.SignatureHash;
// Pass all sighashTypes through as allowed to btc-signer
export const allSighashTypes = [
  btc.SignatureHash.DEFAULT,
  SignatureHash.ALL,
  SignatureHash.NONE,
  SignatureHash.SINGLE,
  btc.SignatureHash.ANYONECANPAY,
  SignatureHash.ALL_ANYONECANPAY,
  SignatureHash.NONE_ANYONECANPAY,
  SignatureHash.SINGLE_ANYONECANPAY,
];

const rpcSignPsbtParamsSchema = yup.object().shape({
  account: accountSchema,
  allowedSighash: yup.array(),
  broadcast: yup.boolean(),
  hex: yup.string().required(),
  network: yup.string().oneOf(Object.values(WalletDefaultNetworkConfigurationIds)),
  signAtIndex: yup.mixed<number | number[]>().test(testIsNumberOrArrayOfNumbers),
});

// TODO: Import param types from btckit when updated
export function validateRpcSignPsbtParams(obj: unknown) {
  return validateRpcParams(obj, rpcSignPsbtParamsSchema);
}

export function getRpcSignPsbtParamErrors(obj: unknown) {
  return formatValidationErrors(getRpcParamErrors(obj, rpcSignPsbtParamsSchema));
}

type SignPsbtRequestParams = yup.InferType<typeof rpcSignPsbtParamsSchema>;

export type SignPsbtRequest = RpcRequest<'signPsbt', SignPsbtRequestParams>;

type SignPsbtResponse = RpcResponse<{ hex: string }>;

export type SignPsbt = DefineRpcMethod<SignPsbtRequest, SignPsbtResponse>;

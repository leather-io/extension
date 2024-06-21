import { SigHash } from '@scure/btc-signer/transaction';
import * as yup from 'yup';

import { WalletDefaultNetworkConfigurationIds } from '@leather.io/models';
import {
  SignatureHash as BtcKitSignatureHash,
  DefineRpcMethod,
  RpcRequest,
  RpcResponse,
} from '@leather.io/rpc';

import {
  accountSchema,
  formatValidationErrors,
  getRpcParamErrors,
  testIsNumberOrArrayOfNumbers,
  validateRpcParams,
} from './validation.utils';

// TODO: Revisit allowedSighash type if/when fixed in btc-signer
export type AllowedSighashTypes = BtcKitSignatureHash | SigHash;
// Pass all sighashTypes through as allowed to btc-signer
export const allSighashTypes = [
  SigHash.DEFAULT,
  BtcKitSignatureHash.ALL,
  BtcKitSignatureHash.NONE,
  BtcKitSignatureHash.SINGLE,
  SigHash.ALL_ANYONECANPAY,
  BtcKitSignatureHash.ALL_ANYONECANPAY,
  BtcKitSignatureHash.NONE_ANYONECANPAY,
  BtcKitSignatureHash.SINGLE_ANYONECANPAY,
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

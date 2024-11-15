import { SigHash } from '@scure/btc-signer/transaction';
import { z } from 'zod';

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

const rpcSignPsbtParamsSchema = z.object({
  account: accountSchema.optional(),
  allowedSighash: z.array(z.any()).optional(),
  broadcast: z.boolean().optional(),
  hex: z.string(),
  network: z
    .enum(Object.values(WalletDefaultNetworkConfigurationIds) as [string, ...string[]])
    .optional(),
  signAtIndex: z
    .union([z.number(), z.array(z.number())])
    .optional()
    .refine(testIsNumberOrArrayOfNumbers),
});

export function validateRpcSignPsbtParams(obj: unknown) {
  return validateRpcParams(obj, rpcSignPsbtParamsSchema);
}

export function getRpcSignPsbtParamErrors(obj: unknown) {
  return formatValidationErrors(getRpcParamErrors(obj, rpcSignPsbtParamsSchema));
}

type SignPsbtRequestParams = z.infer<typeof rpcSignPsbtParamsSchema>;

export type SignPsbtRequest = RpcRequest<'signPsbt', SignPsbtRequestParams>;

type SignPsbtResponse = RpcResponse<{ hex: string }>;

export type SignPsbt = DefineRpcMethod<SignPsbtRequest, SignPsbtResponse>;

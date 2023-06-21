import { DefineRpcMethod, RpcRequest, RpcResponse } from '@btckit/types';
import * as yup from 'yup';

import { networkModes } from '@shared/constants';

const rpcSignPsbtValidator = yup.object().shape({
  publicKey: yup.string().required(),
  allowedSighash: yup.array().of(yup.number().required()),
  hex: yup.string().required(),
  signAtIndex: yup.number().integer().positive(),
  network: yup.string().oneOf(networkModes),
  account: yup.number().integer().positive(),
});

type SignPsbtRequestParams = yup.InferType<typeof rpcSignPsbtValidator>;

export function validateRpcSignPsbtParams(obj: unknown): obj is SignPsbtRequestParams {
  try {
    rpcSignPsbtValidator.validateSync(obj, { abortEarly: false });
    return true;
  } catch (e) {
    return false;
  }
}

export function getRpcSignPsbtParamErrors(obj: unknown) {
  try {
    rpcSignPsbtValidator.validateSync(obj, { abortEarly: false });
    return [];
  } catch (e) {
    if (e instanceof yup.ValidationError) return e.inner;
    return [];
  }
}

export type SignPsbtRequest = RpcRequest<'signPsbt', SignPsbtRequestParams>;

type SignPsbtResponse = RpcResponse<{ hex: string }>;

export type SignPsbt = DefineRpcMethod<SignPsbtRequest, SignPsbtResponse>;

import { DefineRpcMethod, RpcRequest, RpcResponse } from '@btckit/types';
import * as yup from 'yup';

import { networkModes } from '@shared/constants';
import { isDefined, isNumber, isUndefined } from '@shared/utils';

function testIsNumberOrArrayOfNumbers(value: unknown) {
  if (isUndefined(value)) return true;
  if (Array.isArray(value)) return value.every(item => isNumber(item));
  return isNumber(value);
}

const rpcSignPsbtValidator = yup.object().shape({
  publicKey: yup.string().required(),
  allowedSighash: yup.mixed<number | number[]>().when('signAtIndex', {
    is: (signAtIndex: unknown) => isDefined(signAtIndex),
    then: schema =>
      schema
        .test(testIsNumberOrArrayOfNumbers)
        .required('allowedSighash required when signAtIndex is provided'),
    otherwise: schema => schema.test(testIsNumberOrArrayOfNumbers),
  }),
  hex: yup.string().required(),
  signAtIndex: yup.mixed<number | number[]>().test(testIsNumberOrArrayOfNumbers),
  network: yup.string().oneOf(networkModes),
  account: yup.number().integer(),
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

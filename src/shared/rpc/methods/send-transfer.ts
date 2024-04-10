import type { SendTransferRequestParams } from '@btckit/types';
import * as yup from 'yup';

import { WalletDefaultNetworkConfigurationIds } from '@shared/constants';

import {
  accountSchema,
  formatValidationErrors,
  getRpcParamErrors,
  validateRpcParams,
} from './validation.utils';

export const rpcSendTransferParamsSchemaLegacy = yup.object().shape({
  account: accountSchema,
  address: yup.string().required(),
  amount: yup.string().required(),
  network: yup.string().oneOf(Object.values(WalletDefaultNetworkConfigurationIds)),
});

export const rpcSendTransferParamsSchema = yup.object().shape({
  account: accountSchema,
  recipients: yup
    .array()
    .of(yup.object().shape({ address: yup.string().required(), amount: yup.string().required() }))
    .required(),
  network: yup.string().oneOf(Object.values(WalletDefaultNetworkConfigurationIds)),
});

export interface RpcSendTransferParamsLegacy extends SendTransferRequestParams {
  network: string;
}

export interface RpcSendTransferRecipient {
  address: string;
  amount: string;
}

export interface RpcSendTransferParams {
  account?: number;
  recipients: RpcSendTransferRecipient[];
  network: string;
}

export function convertRpcSendTransferLegacyParamsToNew(params: RpcSendTransferParamsLegacy) {
  return {
    recipients: [{ address: params.address, amount: params.amount }],
    network: params.network,
    account: params.account,
  };
}

export function validateRpcSendTransferLegacyParams(obj: unknown) {
  return validateRpcParams(obj, rpcSendTransferParamsSchemaLegacy);
}

export function validateRpcSendTransferParams(obj: unknown) {
  return validateRpcParams(obj, rpcSendTransferParamsSchema);
}

export function getRpcSendTransferParamErrors(obj: unknown) {
  return formatValidationErrors(getRpcParamErrors(obj, rpcSendTransferParamsSchema));
}

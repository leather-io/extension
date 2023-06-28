import * as yup from 'yup';

import { WalletDefaultNetworkConfigurationIds } from '@shared/constants';

import {
  accountSchema,
  formatValidationErrors,
  getRpcParamErrors,
  validateRpcParams,
} from './validation.utils';

const rpcSendTransferParamsSchema = yup.object().shape({
  account: accountSchema,
  address: yup.string().required(),
  amount: yup.string().required(),
  network: yup.string().oneOf(Object.values(WalletDefaultNetworkConfigurationIds)),
});

// TODO: Import param types from btckit when updated
export function validateRpcSendTransferParams(obj: unknown) {
  return validateRpcParams(obj, rpcSendTransferParamsSchema);
}

export function getRpcSendTransferParamErrors(obj: unknown) {
  return formatValidationErrors(getRpcParamErrors(obj, rpcSendTransferParamsSchema));
}

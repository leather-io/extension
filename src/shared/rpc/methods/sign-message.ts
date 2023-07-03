import { PaymentTypes } from '@btckit/types';
import * as yup from 'yup';

import { WalletDefaultNetworkConfigurationIds } from '@shared/constants';

import {
  accountSchema,
  formatValidationErrors,
  getRpcParamErrors,
  validateRpcParams,
} from './validation.utils';

// TODO: Import Bip322MessageTypes from btckit when updated
type SupportedBip322MessageTypes = 'bip322';

const rpcSignMessageParamsSchema = yup.object().shape({
  type: yup.string<SupportedBip322MessageTypes>(),
  account: accountSchema,
  message: yup.string().required(),
  network: yup.string().oneOf(Object.values(WalletDefaultNetworkConfigurationIds)),
  paymentType: yup.string<PaymentTypes>(),
});

// TODO: Import param types from btckit when updated
export function validateRpcSignMessageParams(obj: unknown) {
  return validateRpcParams(obj, rpcSignMessageParamsSchema);
}

export function getRpcSignMessageParamErrors(obj: unknown) {
  return formatValidationErrors(getRpcParamErrors(obj, rpcSignMessageParamsSchema));
}

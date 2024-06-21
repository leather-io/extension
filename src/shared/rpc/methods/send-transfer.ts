import type { SendTransferRequestParams } from '@btckit/types';
import * as yup from 'yup';

import { type BitcoinNetworkModes, WalletDefaultNetworkConfigurationIds } from '@leather.io/models';

import { FormErrorMessages } from '@shared/error-messages';
import { checkIfDigitsOnly } from '@shared/forms/amount-validators';
import {
  btcAddressNetworkValidator,
  btcAddressValidator,
} from '@shared/forms/bitcoin-address-validators';

import {
  accountSchema,
  formatValidationErrors,
  getRpcParamErrors,
  validateRpcParams,
} from './validation.utils';

export const defaultRpcSendTransferNetwork = 'mainnet';

export const rpcSendTransferParamsSchemaLegacy = yup.object().shape({
  account: accountSchema,
  address: yup.string().required(),
  amount: yup.string().required(),
  network: yup.string().oneOf(Object.values(WalletDefaultNetworkConfigurationIds)),
});

export const rpcSendTransferParamsSchema = yup.object().shape({
  account: accountSchema,
  network: yup.string().oneOf(Object.values(WalletDefaultNetworkConfigurationIds)),
  recipients: yup
    .array()
    .required()
    .of(
      yup.object().shape({
        // check network is valid for address
        address: btcAddressValidator().test(
          'address-network-validation',
          FormErrorMessages.IncorrectNetworkAddress,
          (value, context) => {
            const contextOptions = context.options as any;
            const network =
              (contextOptions.from[1].value.network as BitcoinNetworkModes) ||
              defaultRpcSendTransferNetwork;
            return btcAddressNetworkValidator(network).isValidSync(value);
          }
        ),
        amount: yup
          .string()
          .required()
          .test('amount-validation', 'Sat denominated amounts only', value => {
            return checkIfDigitsOnly(value);
          }),
      })
    ),
});

export interface RpcSendTransferParamsLegacy extends SendTransferRequestParams {
  network: string;
}

interface TransferRecipientParam {
  address: string;
  amount: string;
}

export interface RpcSendTransferParams {
  account?: number;
  recipients: TransferRecipientParam[];
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

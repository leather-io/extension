import { z } from 'zod';

import { type BitcoinNetworkModes, type DefaultNetworkConfigurations } from '@leather.io/models';
import type { RpcParams, sendTransfer } from '@leather.io/rpc';
import { uniqueArray } from '@leather.io/utils';

import { FormErrorMessages } from '@shared/error-messages';
import {
  btcAddressNetworkValidator,
  getNetworkTypeFromAddress,
} from '@shared/forms/address-validators';
import { checkIfDigitsOnly } from '@shared/forms/amount-validators';

import { defaultNetworkIdSchema } from '../rpc-schemas';
import {
  accountSchema,
  formatValidationErrors,
  getRpcParamErrors,
  validateRpcParams,
} from './validation.utils';

export const defaultRpcSendTransferNetwork = 'mainnet';

function defaultNetworkIdToBitcoinNetworkMode(
  networkId: DefaultNetworkConfigurations
): BitcoinNetworkModes {
  switch (networkId) {
    case 'mainnet':
      return 'mainnet';
    case 'testnet':
    case 'testnet4':
      return 'testnet';
    case 'sbtcTestnet':
    case 'sbtcDevenv':
    case 'devnet':
      return 'regtest';
    case 'signet':
      return 'signet';
  }
}

export const rpcSendTransferParamsSchemaLegacy = z.object({
  account: accountSchema.optional(),
  address: z.string(),
  amount: z.string(),
  network: defaultNetworkIdSchema.optional(),
});

export const rpcSendTransferParamsSchema = z
  .object({
    account: accountSchema.optional(),
    network: defaultNetworkIdSchema.optional(),
    recipients: z
      .array(
        z.object({
          address: z.string(),
          amount: z.string().refine(value => checkIfDigitsOnly(value), {
            message: 'Sat denominated amounts only',
          }),
        })
      )
      .nonempty()
      .refine(
        recipients => {
          const inferredNetworksByAddress = recipients.map(({ address }) =>
            getNetworkTypeFromAddress(address)
          );
          return uniqueArray(inferredNetworksByAddress).length === 1;
        },
        { message: 'Cannot transfer to addresses of different networks', path: ['recipients'] }
      ),
  })
  .refine(
    ({ network, recipients }) => {
      if (!network) return true;

      const addressNetworks = recipients.map(recipient =>
        btcAddressNetworkValidator(defaultNetworkIdToBitcoinNetworkMode(network)).isValidSync(
          recipient.address
        )
      );

      return !addressNetworks.some(val => val === false);
    },
    { message: FormErrorMessages.IncorrectNetworkAddress, path: ['recipients'] }
  );

export function convertRpcSendTransferLegacyParamsToNew(
  params: Extract<RpcParams<typeof sendTransfer>, { address: string }>
) {
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

import { ChainID } from '@stacks/transactions';
import * as yup from 'yup';

import { NetworkConfiguration } from '@shared/constants';

import { FormErrorMessages } from '@app/common/error-messages';
import { fetchBtcNameOwner, fetchNameOwner } from '@app/query/stacks/bns/bns.utils';
import { StacksClient } from '@app/query/stacks/stacks-client';

import {
  btcAddressValidator,
  notCurrentAddressValidator,
  stxAddressNetworkValidator,
  stxAddressValidator,
} from './address-validators';

// ts-unused-exports:disable-next-line
export function stxRecipientValidator(
  currentAddress: string,
  currentNetwork: NetworkConfiguration
) {
  return stxAddressValidator(FormErrorMessages.InvalidAddress)
    .concat(stxAddressNetworkValidator(currentNetwork))
    .concat(notCurrentAddressValidator(currentAddress || ''));
}

interface StxRecipientAddressOrBnsNameValidatorArgs {
  client: StacksClient;
  currentAddress: string;
  currentNetwork: NetworkConfiguration;
}
// TODO: This validation is messy, but each individual test is needed
// to ensure the error message returned is correct here, otherwise it
// just returns the invalid address error
export function stxRecipientAddressOrBnsNameValidator({
  client,
  currentAddress,
  currentNetwork,
}: StxRecipientAddressOrBnsNameValidatorArgs) {
  return (
    yup
      .string()
      .defined('Enter a Stacks address')
      // BNS name lookup validation
      .test({
        message: FormErrorMessages.InvalidAddress,
        test: async value => {
          if (value?.includes('.')) {
            try {
              const isTestnet = currentNetwork.chain.stacks.chainId === ChainID.Testnet;
              const owner = await fetchNameOwner(client, value ?? '', isTestnet);
              return owner !== null;
            } catch (e) {
              return false;
            }
          }
          return true;
        },
      })
      // Stacks address validations
      .test({
        message: FormErrorMessages.InvalidAddress,
        test: async value => {
          if (!value?.includes('.')) {
            try {
              await stxAddressValidator(currentAddress).validate(value);
              return true;
            } catch (e) {
              return false;
            }
          }
          return true;
        },
      })
      .test({
        message: FormErrorMessages.IncorrectNetworkAddress,
        test: async value => {
          if (!value?.includes('.')) {
            try {
              await stxAddressNetworkValidator(currentNetwork).validate(value);
              return true;
            } catch (e) {
              return false;
            }
          }
          return true;
        },
      })
      .test({
        message: FormErrorMessages.SameAddress,
        test: async value => {
          if (!value?.includes('.')) {
            try {
              await notCurrentAddressValidator(currentAddress || '').validate(value);
              return true;
            } catch (e) {
              return false;
            }
          }
          return true;
        },
      })
  );
}

export function btcRecipientAddressOrBnsNameValidator({ client }: { client: StacksClient }) {
  return yup.string().test({
    name: 'btcRecipientOrBnsName',
    message: 'Recipient is not valid',
    test: async value => {
      try {
        await btcAddressValidator().validate(value);
        return true;
      } catch (e) {}
      try {
        const btcAddress = await fetchBtcNameOwner(client, value ?? '');
        await btcAddressValidator().validate(btcAddress);
        return true;
      } catch (error) {
        return false;
      }
    },
  });
}

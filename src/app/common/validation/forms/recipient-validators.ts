import { ChainID } from '@stacks/transactions';
import * as yup from 'yup';

import { NetworkConfiguration } from '@shared/constants';

import { FormErrorMessages } from '@app/common/error-messages';
import { StacksClient } from '@app/query/stacks/stacks-client';

import { fetchBtcNameOwner, fetchNameOwner } from '../../../query/stacks/bns/bns.utils';
import {
  btcAddressValidator,
  notCurrentAddressValidator,
  stxAddressNetworkValidatorFactory,
  stxAddressValidator,
} from './address-validators';

export function stxRecipientValidator(
  currentAddress: string,
  currentNetwork: NetworkConfiguration
) {
  return stxAddressValidator(FormErrorMessages.InvalidAddress)
    .test({
      message: FormErrorMessages.IncorrectNetworkAddress,
      test: stxAddressNetworkValidatorFactory(currentNetwork),
    })
    .concat(notCurrentAddressValidator(currentAddress || ''));
}

interface StxRecipientAddressOrBnsNameValidatorArgs {
  client: StacksClient;
  currentAddress: string;
  currentNetwork: NetworkConfiguration;
}
export function stxRecipientAddressOrBnsNameValidator({
  client,
  currentAddress,
  currentNetwork,
}: StxRecipientAddressOrBnsNameValidatorArgs) {
  return yup.string().test({
    message: FormErrorMessages.InvalidAddress,
    test: async value => {
      try {
        await stxRecipientValidator(currentAddress, currentNetwork).validate(value);
        return true;
      } catch (e) {}
      try {
        const isTestnet = currentNetwork.chain.stacks.chainId === ChainID.Testnet;
        const owner = await fetchNameOwner(client, value ?? '', isTestnet);
        return owner !== null;
      } catch (e) {
        return false;
      }
    },
  });
}

export function btcRecipientOrBnsNameValidator({ client }: { client: StacksClient }) {
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

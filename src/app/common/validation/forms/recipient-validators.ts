import * as yup from 'yup';

import { NetworkConfiguration } from '@shared/constants';

import { FormErrorMessages } from '@app/common/error-messages';
import { fetchBtcNameOwner } from '@app/query/stacks/bns/bns.utils';
import { StacksClient } from '@app/query/stacks/stacks-client';

import {
  btcAddressValidator,
  notCurrentAddressValidator,
  stxAddressNetworkValidator,
  stxAddressValidator,
} from './address-validators';

export function stxRecipientValidator(
  currentAddress: string,
  currentNetwork: NetworkConfiguration
) {
  return stxAddressValidator(FormErrorMessages.InvalidAddress)
    .concat(stxAddressNetworkValidator(currentNetwork))
    .concat(notCurrentAddressValidator(currentAddress || ''));
}

export function btcRecipientAddressOrBnsNameValidator({ client }: { client: StacksClient }) {
  return yup.string().test({
    name: 'btcRecipientOrBnsName',
    message: FormErrorMessages.InvalidAddress,
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

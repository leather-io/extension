import { NetworkConfiguration } from '@shared/constants';

import { FormErrorMessages } from '@app/common/error-messages';

import {
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

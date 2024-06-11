import type { NetworkConfiguration } from '@leather-wallet/models';

import { stacksChainIdToCoreNetworkMode } from '@shared/crypto/stacks/stacks.utils';
import { FormErrorMessages } from '@shared/error-messages';

import {
  notCurrentAddressValidator,
  stxAddressNetworkValidator,
  stxAddressValidator,
} from './address-validators';
import { complianceValidator } from './compliance-validators';

export function stxRecipientValidator(
  currentAddress: string,
  currentNetwork: NetworkConfiguration
) {
  return stxAddressValidator(FormErrorMessages.InvalidAddress)
    .concat(stxAddressNetworkValidator(currentNetwork))
    .concat(notCurrentAddressValidator(currentAddress || ''))
    .concat(
      complianceValidator(
        stxAddressValidator(FormErrorMessages.InvalidAddress),
        stacksChainIdToCoreNetworkMode(currentNetwork.chain.stacks.chainId)
      )
    );
}

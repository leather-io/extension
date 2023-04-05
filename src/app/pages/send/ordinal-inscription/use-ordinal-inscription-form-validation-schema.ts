import * as yup from 'yup';

import { FormErrorMessages } from '@app/common/error-messages';
import {
  btcAddressNetworkValidator,
  btcAddressValidator,
  btcTaprootAddressValidator,
} from '@app/common/validation/forms/address-validators';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { recipeintFieldName } from './send-inscription-form';

export function useOrdinalInscriptionFormValidationSchema() {
  const currentNetwork = useCurrentNetwork();
  return yup.object({
    [recipeintFieldName]: yup
      .string()
      .required(FormErrorMessages.AddressRequired)
      .concat(btcAddressValidator())
      .concat(btcAddressNetworkValidator(currentNetwork.chain.bitcoin.network))
      .concat(btcTaprootAddressValidator()),
  });
}

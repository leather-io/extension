import * as yup from 'yup';

import {
  btcAddressNetworkValidator,
  btcAddressValidator,
  notCurrentAddressValidator,
} from '@app/common/validation/forms/address-validators';
import { useCurrentBtcNativeSegwitAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { recipeintFieldName } from './send';

export function useOrdinalInscriptionFormValidationSchema() {
  const currentNetwork = useCurrentNetwork();
  const currentAccountBtcAddress = useCurrentBtcNativeSegwitAccountAddressIndexZero();
  return yup.object().shape({
    [recipeintFieldName]: yup
      .string()
      .required('Please provide a recipient.')
      .concat(btcAddressValidator())
      .concat(btcAddressNetworkValidator(currentNetwork.chain.bitcoin.network))
      .concat(notCurrentAddressValidator(currentAccountBtcAddress || '')),
  });
}

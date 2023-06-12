import { useCallback, useState } from 'react';

import * as btc from '@scure/btc-signer';

import { BitcoinNetworkModes } from '@shared/constants';
import { getAddressFromOutScript } from '@shared/crypto/bitcoin/bitcoin.utils';
import { isUndefined } from '@shared/utils';

import {
  OrdApiInscriptionTxOutput,
  useOrdinalsAwareUtxoQueries,
} from '@app/query/bitcoin/ordinals/ordinals-aware-utxo.query';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

function isPlaceholderTransaction(
  address: string,
  inputs: (OrdApiInscriptionTxOutput | undefined)[],
  outputs: btc.TransactionOutputRequired[],
  network: BitcoinNetworkModes
) {
  const inputsNotFromCurrentAddress = inputs.filter(input => {
    return input?.address !== address;
  });
  const outputsNotToCurrentAddress = outputs.filter(output => {
    const addressFromScript = getAddressFromOutScript(output.script, network);
    return addressFromScript !== address;
  });
  return inputsNotFromCurrentAddress.length === 0 && outputsNotToCurrentAddress.length === 0;
}

interface UsePsbtDecodedRequestArgs {
  unsignedInputs: btc.TransactionInputRequired[];
  unsignedOutputs: btc.TransactionOutputRequired[];
}
export function usePsbtDecodedRequest({
  unsignedInputs,
  unsignedOutputs,
}: UsePsbtDecodedRequestArgs) {
  const [showAdvancedView, setShowAdvancedView] = useState(false);
  const network = useCurrentNetwork();
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const unsignedUtxos = useOrdinalsAwareUtxoQueries(unsignedInputs).map(query => query.data);

  const defaultToAdvancedView = useCallback(() => {
    const noInputs = isUndefined(unsignedUtxos) || !unsignedUtxos.length;
    const noOutputs = isUndefined(unsignedOutputs) || !unsignedOutputs.length;
    return noInputs || noOutputs;
  }, [unsignedOutputs, unsignedUtxos]);

  const showPlaceholder = useCallback(() => {
    return isPlaceholderTransaction(
      nativeSegwitSigner.address,
      unsignedUtxos,
      unsignedOutputs,
      network.chain.bitcoin.network
    );
  }, [nativeSegwitSigner.address, network.chain.bitcoin.network, unsignedOutputs, unsignedUtxos]);

  return {
    onSetShowAdvancedView: () => setShowAdvancedView(!showAdvancedView),
    shouldDefaultToAdvancedView: defaultToAdvancedView(),
    shouldShowPlaceholder: showPlaceholder(),
    showAdvancedView,
  };
}

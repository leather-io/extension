import { useCallback, useState } from 'react';

import * as btc from '@scure/btc-signer';

import { BitcoinNetworkModes } from '@shared/constants';
import { getAddressFromOutScript } from '@shared/crypto/bitcoin/bitcoin.utils';

import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import {
  PsbtDecodedUtxosMainnet,
  PsbtDecodedUtxosTestnet,
  usePsbtDecodedUtxos,
} from './use-psbt-decoded-utxos';

function isPlaceholderTransaction(
  address: string,
  network: BitcoinNetworkModes,
  unsignedOutputs: btc.TransactionOutputRequired[],
  unsignedUtxos: PsbtDecodedUtxosMainnet | PsbtDecodedUtxosTestnet
) {
  let utxosNotFromCurrentAddress = [];

  switch (unsignedUtxos.network) {
    case 'mainnet':
      utxosNotFromCurrentAddress = unsignedUtxos.utxos.filter(utxo => utxo.address !== address);
      break;
    case 'testnet':
      utxosNotFromCurrentAddress = unsignedUtxos.utxos.filter(
        vo => vo.scriptpubkey_address !== address
      );
      break;
  }

  const outputsNotToCurrentAddress = unsignedOutputs.filter(output => {
    const addressFromScript = getAddressFromOutScript(output.script, network);
    return addressFromScript !== address;
  });

  return utxosNotFromCurrentAddress.length === 0 && outputsNotToCurrentAddress.length === 0;
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
  const unsignedUtxos = usePsbtDecodedUtxos(unsignedInputs);

  const defaultToAdvancedView = useCallback(() => {
    const noInputs = !unsignedInputs.length;
    const noOutputs = !unsignedOutputs.length;
    return noInputs || noOutputs;
  }, [unsignedInputs.length, unsignedOutputs.length]);

  const showPlaceholder = useCallback(() => {
    return isPlaceholderTransaction(
      nativeSegwitSigner.address,
      network.chain.bitcoin.network,
      unsignedOutputs,
      unsignedUtxos
    );
  }, [nativeSegwitSigner.address, network.chain.bitcoin.network, unsignedOutputs, unsignedUtxos]);

  return {
    onSetShowAdvancedView: () => setShowAdvancedView(!showAdvancedView),
    shouldDefaultToAdvancedView: defaultToAdvancedView(),
    shouldShowPlaceholder: showPlaceholder(),
    showAdvancedView,
    unsignedUtxos,
  };
}

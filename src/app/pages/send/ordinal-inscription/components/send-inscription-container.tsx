import { useState } from 'react';
import { Outlet, useLocation, useOutletContext } from 'react-router-dom';

import get from 'lodash.get';

import type { AverageBitcoinFeeRates, BtcFeeType, Inscription } from '@leather.io/models';
import { type UtxoWithDerivationPath, useInscriptionsAddressesMap } from '@leather.io/query';

import { useOnMount } from '@app/common/hooks/use-on-mount';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentTaprootAccount } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useSendInscriptionRouteState } from '../hooks/use-send-inscription-route-state';
import { createUtxoFromInscription } from './create-utxo-from-inscription';
import { SendInscriptionLoader } from './send-inscription-loader';

interface SendInscriptionContextState {
  feeRates: AverageBitcoinFeeRates;
  inscription: Inscription;
  selectedFeeType: BtcFeeType;
  setSelectedFeeType(value: BtcFeeType | null): void;
  utxo: UtxoWithDerivationPath;
}
export function useSendInscriptionState() {
  const location = useLocation();
  const context = useOutletContext<SendInscriptionContextState>();
  return { ...context, recipient: get(location.state, 'recipient', '') as string };
}

export function SendInscriptionContainer() {
  const [selectedFeeType, setSelectedFeeType] = useState<BtcFeeType | null>(null);
  const [inscription, setInscription] = useState<Inscription | null>(null);
  const [utxo, setUtxo] = useState<UtxoWithDerivationPath | null>(null);

  const routeState = useSendInscriptionRouteState();
  const network = useCurrentNetwork();
  const currentAccountIndex = useCurrentAccountIndex();
  const account = useCurrentTaprootAccount();
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();

  const addressesMap = useInscriptionsAddressesMap({
    taprootKeychain: account?.keychain,
    nativeSegwitAddress: nativeSegwitSigner.address,
  });
  useOnMount(() => {
    if (!routeState.inscription) return;
    setInscription(routeState.inscription);
    setUtxo(
      createUtxoFromInscription({
        inscription: routeState.inscription,
        network: network.chain.bitcoin.bitcoinNetwork,
        accountIndex: currentAccountIndex,
        inscriptionAddressIdx: addressesMap[routeState.inscription.address],
      })
    );
  });

  if (!inscription || !utxo) return null;

  return (
    <SendInscriptionLoader>
      {({ feeRates }) => (
        <Outlet context={{ feeRates, inscription, selectedFeeType, setSelectedFeeType, utxo }} />
      )}
    </SendInscriptionLoader>
  );
}

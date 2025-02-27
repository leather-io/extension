import { useState } from 'react';
import { Outlet, useLocation, useOutletContext } from 'react-router-dom';

import get from 'lodash.get';

import { createBitcoinAddress, lookupDerivationByAddress } from '@leather.io/bitcoin';
import { extractAddressIndexFromPath } from '@leather.io/crypto';
import type { AverageBitcoinFeeRates, BtcFeeType, Inscription } from '@leather.io/models';
import { type UtxoWithDerivationPath } from '@leather.io/query';

import { analytics } from '@shared/utils/analytics';

import { useOnMount } from '@app/common/hooks/use-on-mount';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useCurrentNativeSegwitAccount } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
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

  const taprootAccount = useCurrentTaprootAccount();
  const nativeSegwitAccount = useCurrentNativeSegwitAccount();

  useOnMount(() => {
    if (!routeState.inscription) return;
    const inscriptionAddress = createBitcoinAddress(routeState.inscription.address);

    const result = lookupDerivationByAddress({
      taprootXpub: taprootAccount?.keychain.publicExtendedKey!,
      nativeSegwitXpub: nativeSegwitAccount?.keychain.publicExtendedKey!,
      iterationLimit: 100,
    })(inscriptionAddress);

    void analytics.untypedTrack('recurse_addresses_to_find_derivation_path', {
      duration: result.duration,
    });

    if (result.status !== 'success') {
      void analytics.untypedTrack('error_did_not_find_owner_path_of_inscription', {
        inscription: routeState.inscription.id,
      });
      throw new Error('Unable to find key of owner inscription address');
    }

    const adddressIndex = extractAddressIndexFromPath(result.path);

    setInscription(routeState.inscription);
    setUtxo(
      createUtxoFromInscription({
        inscription: routeState.inscription,
        network: network.chain.bitcoin.mode,
        accountIndex: currentAccountIndex,
        inscriptionAddressIdx: adddressIndex,
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

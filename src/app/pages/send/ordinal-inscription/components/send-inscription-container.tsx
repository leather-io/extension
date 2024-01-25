import { useState } from 'react';
import { Outlet, useLocation, useOutletContext } from 'react-router-dom';

import get from 'lodash.get';

import { AverageBitcoinFeeRates, BtcFeeType } from '@shared/models/fees/bitcoin-fees.model';
import { SupportedInscription } from '@shared/models/inscription.model';

import { useOnMount } from '@app/common/hooks/use-on-mount';
import { UtxoWithDerivationPath } from '@app/query/bitcoin/bitcoin-client';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useSendInscriptionRouteState } from '../hooks/use-send-inscription-route-state';
import { createUtxoFromInscription } from './create-utxo-from-inscription';
import { SendInscriptionLoader } from './send-inscription-loader';

interface SendInscriptionContextState {
  feeRates: AverageBitcoinFeeRates;
  inscription: SupportedInscription;
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
  const [inscription, setInscription] = useState<SupportedInscription | null>(null);
  const [utxo, setUtxo] = useState<UtxoWithDerivationPath | null>(null);

  const routeState = useSendInscriptionRouteState();
  const network = useCurrentNetwork();
  const currentAccountIndex = useCurrentAccountIndex();

  useOnMount(() => {
    if (!routeState.inscription) return;
    setInscription(routeState.inscription);
    setUtxo(
      createUtxoFromInscription({
        inscription: routeState.inscription,
        network: network.chain.bitcoin.bitcoinNetwork,
        accountIndex: currentAccountIndex,
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

import { useState } from 'react';
import { Outlet, useLocation, useOutletContext } from 'react-router-dom';

import get from 'lodash.get';

import { AverageBitcoinFeeRates, BtcFeeType } from '@shared/models/fees/bitcoin-fees.model';
import { SupportedInscription } from '@shared/models/inscription.model';

import { useOnMount } from '@app/common/hooks/use-on-mount';
import { TaprootUtxo } from '@app/query/bitcoin/bitcoin-client';

import { useSendInscriptionRouteState } from '../hooks/use-send-inscription-route-state';
import { createUtxoFromInscription } from './create-utxo-from-inscription';
import { SendInscriptionLoader } from './send-inscription-loader';

interface SendInscriptionContextState {
  feeRates: AverageBitcoinFeeRates;
  inscription: SupportedInscription;
  selectedFeeType: BtcFeeType;
  setSelectedFeeType(value: BtcFeeType | null): void;
  utxo: TaprootUtxo;
}
export function useSendInscriptionState() {
  const location = useLocation();
  const context = useOutletContext<SendInscriptionContextState>();
  return { ...context, recipient: get(location.state, 'recipient', '') as string };
}

export function SendInscriptionContainer() {
  const [selectedFeeType, setSelectedFeeType] = useState<BtcFeeType | null>(null);
  const [inscription, setInscription] = useState<SupportedInscription | null>(null);
  const [utxo, setUtxo] = useState<TaprootUtxo | null>(null);

  const routeState = useSendInscriptionRouteState();

  useOnMount(() => {
    if (!routeState.inscription) return;
    setInscription(routeState.inscription);
    setUtxo(createUtxoFromInscription(routeState.inscription));
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

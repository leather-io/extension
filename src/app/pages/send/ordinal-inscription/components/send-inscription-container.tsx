import { useState } from 'react';
import { Outlet, useLocation, useOutletContext } from 'react-router-dom';

import get from 'lodash.get';

import { AverageBitcoinFeeRates, BtcFeeType } from '@shared/models/fees/bitcoin-fees.model';
import { SupportedInscription } from '@shared/models/inscription.model';

import { TaprootUtxo } from '@app/query/bitcoin/ordinals/use-taproot-address-utxos.query';

import { SendInscriptionLoader } from './send-inscription-loader';

export interface SendInscriptionContextState {
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
  const [selectedFeeType, setSelectedFeeType] = useState<BtcFeeType | null>(BtcFeeType.Standard);

  return (
    <SendInscriptionLoader>
      {({ feeRates, inscription, utxo }) => (
        <Outlet context={{ feeRates, inscription, selectedFeeType, setSelectedFeeType, utxo }} />
      )}
    </SendInscriptionLoader>
  );
}

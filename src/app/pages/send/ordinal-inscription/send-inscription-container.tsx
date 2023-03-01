import { Navigate, Outlet, useOutletContext } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { FeeEstimateMempoolSpaceApi } from '@app/query/bitcoin/bitcoin-client';
import { useBitcoinFeeRate } from '@app/query/bitcoin/fees/fee-estimates.hooks';
import { TaprootUtxo } from '@app/query/bitcoin/ordinals/use-taproot-address-utxos.query';

import {
  Inscription,
  useSendOrdinalInscriptionRouteState,
} from './use-send-ordinal-inscription-route-state';

interface InscriptionSendState {
  inscription: Inscription;
  utxo: TaprootUtxo;
  fees: FeeEstimateMempoolSpaceApi;
}

export function useInscriptionSendState() {
  return useOutletContext<InscriptionSendState>();
}

interface SendInscriptionLoaderProps {
  children(data: InscriptionSendState): JSX.Element;
}
function SendInscriptionLoader({ children }: SendInscriptionLoaderProps) {
  const { inscription, utxo } = useSendOrdinalInscriptionRouteState();
  const { data: fees } = useBitcoinFeeRate();
  if (!fees) return null;
  if (!inscription || !utxo) return <Navigate to={RouteUrls.Home} />;
  return children({ inscription, utxo, fees });
}

export function SendInscription() {
  return (
    <SendInscriptionLoader>
      {({ fees, inscription, utxo }) => <Outlet context={{ fees, inscription, utxo }} />}
    </SendInscriptionLoader>
  );
}

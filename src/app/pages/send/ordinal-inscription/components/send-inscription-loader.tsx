import { Navigate, useLocation, useOutletContext } from 'react-router-dom';

import get from 'lodash.get';

import { AverageBitcoinFeeRates } from '@shared/models/fees/bitcoin-fees.model';
import { SupportedInscription } from '@shared/models/inscription.model';
import { RouteUrls } from '@shared/route-urls';

import { useAverageBitcoinFeeRates } from '@app/query/bitcoin/fees/fee-estimates.hooks';
import { TaprootUtxo } from '@app/query/bitcoin/ordinals/use-taproot-address-utxos.query';

import { useSendInscriptionRouteState } from '../hooks/use-send-inscription-route-state';
import { createUtxoFromInscription } from './create-utxo-from-inscription';

interface InscriptionSendState {
  feeRates: AverageBitcoinFeeRates;
  inscription: SupportedInscription;
  utxo: TaprootUtxo;
}
export function useInscriptionSendState() {
  const location = useLocation();
  const context = useOutletContext<InscriptionSendState>();
  return { ...context, recipient: get(location.state, 'recipient', '') as string };
}

interface SendInscriptionLoaderProps {
  children(data: InscriptionSendState): JSX.Element;
}
export function SendInscriptionLoader({ children }: SendInscriptionLoaderProps) {
  const { inscription } = useSendInscriptionRouteState();
  const { avgApiFeeRates: feeRates } = useAverageBitcoinFeeRates();

  if (!feeRates) return null;

  if (!inscription) return <Navigate to={RouteUrls.Home} />;

  const utxo = createUtxoFromInscription(inscription);

  return children({ inscription, feeRates, utxo });
}

import { Navigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useAverageBitcoinFeeRates } from '@app/query/bitcoin/fees/fee-estimates.hooks';

import { useSendInscriptionRouteState } from '../hooks/use-send-inscription-route-state';
import { createUtxoFromInscription } from './create-utxo-from-inscription';
import { SendInscriptionContextState } from './send-inscription-container';

interface SendInscriptionLoaderProps {
  children(data: Partial<SendInscriptionContextState>): React.JSX.Element;
}
export function SendInscriptionLoader({ children }: SendInscriptionLoaderProps) {
  const { inscription } = useSendInscriptionRouteState();
  const { data: feeRates } = useAverageBitcoinFeeRates();

  if (!feeRates) return null;

  if (!inscription) return <Navigate to={RouteUrls.Home} />;

  const utxo = createUtxoFromInscription(inscription);

  return children({ inscription, feeRates, utxo });
}

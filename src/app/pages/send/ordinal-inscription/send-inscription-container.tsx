import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom';

import get from 'lodash.get';

import { SupportedInscription } from '@shared/models/inscription.model';
import { RouteUrls } from '@shared/route-urls';

import { FeeEstimateMempoolSpaceApi } from '@app/query/bitcoin/bitcoin-client';
import { useBitcoinFeeRate } from '@app/query/bitcoin/fees/fee-estimates.hooks';

import { useSendOrdinalInscriptionRouteState } from './use-send-ordinal-inscription-route-state';

interface InscriptionSendState {
  fees: FeeEstimateMempoolSpaceApi;
  inscription: SupportedInscription;
}

export function useInscriptionSendState() {
  const location = useLocation();
  const context = useOutletContext<InscriptionSendState>();
  return { ...context, recipient: get(location, 'state.recipient', '') as string };
}

interface SendInscriptionLoaderProps {
  children(data: InscriptionSendState): JSX.Element;
}
function SendInscriptionLoader({ children }: SendInscriptionLoaderProps) {
  const { inscription } = useSendOrdinalInscriptionRouteState();
  const { data: fees } = useBitcoinFeeRate();
  if (!fees) return null;
  if (!inscription) return <Navigate to={RouteUrls.Home} />;
  return children({ inscription, fees });
}

export function SendInscription() {
  return (
    <SendInscriptionLoader>
      {({ fees, inscription }) => <Outlet context={{ fees, inscription }} />}
    </SendInscriptionLoader>
  );
}

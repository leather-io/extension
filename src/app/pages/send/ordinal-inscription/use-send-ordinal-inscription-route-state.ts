import { useLocation } from 'react-router-dom';

import { OrdinalInfo } from '@app/query/bitcoin/ordinals/utils';

export function useSendOrdinalInscriptionRouteState() {
  const { state } = useLocation();
  return state as OrdinalInfo;
}

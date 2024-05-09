import { useLocation } from 'react-router-dom';

import type { InscriptionResponse } from '@leather-wallet/query';
import get from 'lodash.get';

export function useSendInscriptionRouteState() {
  const location = useLocation();
  return {
    inscriptionResponse: get(
      location.state,
      'inscriptionResponse',
      null
    ) as InscriptionResponse | null,
  };
}

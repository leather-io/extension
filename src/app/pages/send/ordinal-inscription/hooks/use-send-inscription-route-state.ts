import { useLocation } from 'react-router-dom';

import type { Inscription } from '@leather-wallet/models';
import get from 'lodash.get';

export function useSendInscriptionRouteState() {
  const location = useLocation();
  return {
    inscription: get(location.state, 'inscription', null) as Inscription | null,
  };
}

import { useLocation } from 'react-router-dom';

import get from 'lodash.get';

import type { Inscription } from '@leather.io/models';

export function useSendInscriptionRouteState() {
  const location = useLocation();
  return {
    inscription: get(location.state, 'inscription', null) as Inscription | null,
  };
}

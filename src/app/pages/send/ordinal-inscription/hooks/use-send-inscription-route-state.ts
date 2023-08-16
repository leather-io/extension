import { useLocation } from 'react-router-dom';

import get from 'lodash.get';

import { SupportedInscription } from '@shared/models/inscription.model';

export function useSendInscriptionRouteState() {
  const location = useLocation();
  return {
    inscription: get(location.state, 'inscription', null) as SupportedInscription | null,
  };
}

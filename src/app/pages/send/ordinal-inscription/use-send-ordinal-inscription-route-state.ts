import { useLocation } from 'react-router-dom';

import get from 'lodash.get';

import { SupportedInscription } from '@shared/models/inscription.model';

import { TaprootUtxo } from '@app/query/bitcoin/ordinals/use-taproot-address-utxos.query';

export function useSendOrdinalInscriptionRouteState() {
  const location = useLocation();
  return {
    inscription: get(location, 'state.inscription', null) as SupportedInscription | null,
    utxo: get(location, 'state.utxo', null) as TaprootUtxo | null,
  };
}

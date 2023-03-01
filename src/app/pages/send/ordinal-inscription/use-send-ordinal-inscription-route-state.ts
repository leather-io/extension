import { useLocation } from 'react-router-dom';

import get from 'lodash.get';

import { TaprootUtxo } from '@app/query/bitcoin/ordinals/use-taproot-address-utxos.query';

// schema doesn't have full type info, copying for now
// if we do yup infer trick, let's type full schema
export interface Inscription {
  address: string;
  content: string;
  'content length': string;
  'content type': string;
  'genesis fee': string;
  'genesis height': string;
  'genesis transaction': string;
  id: string;
  inscription_number: number;
  location: string;
  offset: string;
  output: string;
  'output value': string;
  preview: string;
  sat: string;
  timestamp: string;
  title: string;
}

export function useSendOrdinalInscriptionRouteState() {
  const location = useLocation();
  return {
    inscription: get(location, 'state.inscription', null) as Inscription | null,
    utxo: get(location, 'state.utxo', null) as TaprootUtxo | null,
  };
}

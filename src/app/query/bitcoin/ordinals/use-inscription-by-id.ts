import axios from 'axios';

import { InscriptionResponseItem } from '@shared/models/inscription.model';

import { HIRO_INSCRIPTIONS_API_URL } from '@app/query/query-config';

export async function fetchInscripionById(id: string) {
  return axios.get<InscriptionResponseItem>(`${HIRO_INSCRIPTIONS_API_URL}}/${id}`);
}

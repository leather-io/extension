import axios from 'axios';

import { HIRO_INSCRIPTIONS_API_URL } from '@shared/constants';
import { InscriptionResponseItem } from '@shared/models/inscription.model';

export async function fetchInscripionById(id: string) {
  return axios.get<InscriptionResponseItem>(`${HIRO_INSCRIPTIONS_API_URL}}/${id}`);
}

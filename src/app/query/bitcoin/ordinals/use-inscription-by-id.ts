import axios from 'axios';

import { InscriptionResponseItem } from '@shared/models/inscription.model';

export async function fetchInscripionById(id: string) {
  return axios.get<InscriptionResponseItem>(`https://api.hiro.so/ordinals/v1/inscriptions/${id}`);
}

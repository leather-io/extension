import { Paginated } from '@shared/models/api-types';
import { Inscription } from '@shared/models/inscription.model';

import { HIRO_INSCRIPTIONS_API_URL } from '@app/query/query-config';

export function fetchInscriptionByParam() {
  return async (param: string) => {
    const res = await fetch(`${HIRO_INSCRIPTIONS_API_URL}?${param}`);
    if (!res.ok) throw new Error('Error retrieving inscription metadata');
    const data = await res.json();
    return data as Paginated<Inscription[]>;
  };
}

export type FetchInscriptionResp = Awaited<ReturnType<ReturnType<typeof fetchInscriptionByParam>>>;

import { useQuery } from '@tanstack/react-query';
import * as yup from 'yup';

import { Prettify } from '@shared/utils/type-utils';

import { QueryPrefixes } from '@app/query/query-prefixes';

/**
 * Schema of data used from the `GET https://ordapi.xyz/inscriptions/:id` endpoint. Additional data
 * that is not currently used by the app may be returned by this endpoint.
 *
 * See API docs, https://ordapi.xyz/
 */
const ordApiGetInscriptionByInscriptionSchema = yup
  .object({
    content_type: yup.string().required(),
    content: yup.string().required(),
    inscription_number: yup.number().required(),
    preview: yup.string().required(),
    title: yup.string().required(),
  })
  .required();

type OrdApiGetInscriptionByInscription = Prettify<
  yup.InferType<typeof ordApiGetInscriptionByInscriptionSchema>
>;

async function getInscription(path: string): Promise<OrdApiGetInscriptionByInscription> {
  const res = await fetch(`https://ordapi.xyz${path}`);
  if (!res.ok) throw new Error('Error retrieving inscription metadata.');
  const data = await res.json();

  return ordApiGetInscriptionByInscriptionSchema.validate(data);
}

export function useInscriptionQuery(path: string) {
  return useQuery([QueryPrefixes.InscriptionMetadata, path], () => getInscription(path), {
    enabled: !!path,
    staleTime: Infinity,
    cacheTime: Infinity,
  });
}

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { QueryPrefixes } from '@app/query/query-prefixes';

async function getInscriptionTextContent(src: string) {
  const res = await axios.get(src, { responseType: 'text' });
  return res.data;
}

export function useInscriptionTextContentQuery(contentSrc: string) {
  return useQuery(
    [QueryPrefixes.OrdinalTextContent, contentSrc],
    () => getInscriptionTextContent(contentSrc),
    {
      cacheTime: Infinity,
      staleTime: Infinity,
    }
  );
}

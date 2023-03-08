import { useQuery } from '@tanstack/react-query';

import { QueryPrefixes } from '@app/query/query-prefixes';

async function getTextInscriptionContent(src: string) {
  const res = await fetch(src);
  if (!res.ok) throw new Error('Failed to fetch ordinal text content');
  return res.text();
}

export function useTextInscriptionContentQuery(contentSrc: string) {
  return useQuery(
    [QueryPrefixes.OrdinalTextContent, contentSrc],
    () => getTextInscriptionContent(contentSrc),
    {
      cacheTime: Infinity,
      staleTime: Infinity,
    }
  );
}

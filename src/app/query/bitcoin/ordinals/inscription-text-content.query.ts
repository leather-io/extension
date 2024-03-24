import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { QueryPrefixes } from '@app/query/query-prefixes';
import { useHiroApiRateLimiter } from '@app/query/stacks/hiro-rate-limiter';

async function getInscriptionTextContent(src: string) {
  const res = await axios.get(src, { responseType: 'text' });
  return res.data;
}

export function useInscriptionTextContentQuery(contentSrc: string) {
  const limiter = useHiroApiRateLimiter();
  return useQuery(
    [QueryPrefixes.OrdinalTextContent, contentSrc],
    async () => {
      return limiter.add(() => getInscriptionTextContent(contentSrc), {
        throwOnTimeout: true,
      });
    },
    {
      cacheTime: Infinity,
      staleTime: Infinity,
    }
  );
}

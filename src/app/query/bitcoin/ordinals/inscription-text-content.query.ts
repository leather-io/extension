import { useQuery } from '@tanstack/react-query';

import { BitcoinQueryPrefixes, fetchInscriptionTextContent } from '@leather.io/query';

import { useBestInSlotApiRateLimiter } from '@app/query/rate-limiter/best-in-slot-limiter';

const queryOptions = {
  staleTime: Infinity,
  gcTime: Infinity,
} as const;

export function useGetInscriptionTextContentQuery(contentSrc: string) {
  const limiter = useBestInSlotApiRateLimiter();
  return useQuery({
    queryKey: [BitcoinQueryPrefixes.GetInscriptionTextContent, contentSrc],
    queryFn: async () => {
      return limiter.add(() => fetchInscriptionTextContent(contentSrc), {
        throwOnTimeout: true,
      });
    },
    ...queryOptions,
  });
}

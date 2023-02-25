import { useQuery } from '@tanstack/react-query';

export function useTextInscriptionContentQuery(contentSrc: string) {
  return useQuery(
    ['ordinal-text-content', contentSrc] as const,
    async ({ queryKey }) => {
      const [_, contentSrc] = queryKey;
      const res = await fetch(contentSrc);
      if (!res.ok) throw new Error('Failed to fetch ordinal text content.');

      return res.text();
    },
    {
      cacheTime: Infinity,
      staleTime: Infinity,
    }
  );
}

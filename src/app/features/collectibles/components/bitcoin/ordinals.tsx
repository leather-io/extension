import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { Box } from 'leather-styles/jsx';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useGetInscriptionsInfiniteQuery } from '@app/query/bitcoin/ordinals/inscriptions.query';

import { Inscription } from './inscription';

interface OrdinalsProps {
  setIsLoadingMore(isLoading: boolean): void;
}
export function Ordinals({ setIsLoadingMore }: OrdinalsProps) {
  const query = useGetInscriptionsInfiniteQuery();
  const pages = query.data?.pages;
  const analytics = useAnalytics();
  const { ref: intersectionSentinel, inView } = useInView({
    rootMargin: '0% 0% 20% 0%',
  });

  useEffect(() => {
    async function fetchNextPage() {
      if (!query.hasNextPage || query.isLoading || query.isFetchingNextPage) return;
      try {
        setIsLoadingMore(true);
        await query.fetchNextPage();
      } catch (e) {
        // TO-DO: handle error
        // console.log(e);
      } finally {
        setIsLoadingMore(false);
      }
    }
    if (inView) {
      void fetchNextPage();
    }
  }, [inView, query, setIsLoadingMore]);

  useEffect(() => {
    const inscriptionsLength = pages?.reduce((acc, page) => acc + page.inscriptions.length, 0) || 0;
    if (inscriptionsLength > 0) {
      void analytics.track('view_collectibles', {
        ordinals_count: inscriptionsLength,
      });
      void analytics.identify({ ordinals_count: inscriptionsLength });
    }
  }, [pages, analytics]);

  if (!pages) return null;

  return (
    <>
      {pages.map(page =>
        page.inscriptions.map(inscription => (
          <Inscription rawInscription={inscription} key={inscription.id} />
        ))
      )}
      <Box ref={intersectionSentinel} />
    </>
  );
}

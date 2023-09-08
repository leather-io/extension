import { useEffect, useRef } from 'react';

import { Box } from 'leather-styles/jsx';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useIntersectionObserver } from '@app/common/hooks/use-intersection-observer';
import { useTaprootInscriptionsInfiniteQuery } from '@app/query/bitcoin/ordinals/use-inscriptions.query';

import { Inscription } from './inscription';

interface OrdinalsProps {
  setIsLoadingMore: (isLoading: boolean) => void;
}

export function Ordinals({ setIsLoadingMore }: OrdinalsProps) {
  const query = useTaprootInscriptionsInfiniteQuery();
  const pages = query.data?.pages;
  const analytics = useAnalytics();

  const intersectionSentinel = useRef<HTMLDivElement | null>(null);

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
  const callback = (entries: IntersectionObserverEntry[]): void => {
    entries.forEach(async entry => {
      if (entry.isIntersecting) {
        await fetchNextPage();
      }
    });
  };

  useIntersectionObserver(intersectionSentinel, callback, {});
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

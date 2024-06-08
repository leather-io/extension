import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { Box } from 'leather-styles/jsx';

import { useInscriptions } from '@leather-wallet/query';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentTaprootAccount } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

import { Inscription } from './inscription';

interface OrdinalsProps {
  setIsLoadingMore(isLoading: boolean): void;
}
export function Ordinals({ setIsLoadingMore }: OrdinalsProps) {
  const account = useCurrentTaprootAccount();
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();

  const query = useInscriptions({
    taprootKeychain: account?.keychain,
    nativeSegwitAddress: nativeSegwitSigner.address,
  });
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
          <Inscription inscription={inscription} key={inscription.id} />
        ))
      )}
      <Box ref={intersectionSentinel} />
    </>
  );
}

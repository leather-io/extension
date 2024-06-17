import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { Box } from 'leather-styles/jsx';

import { useInscriptions } from '@leather-wallet/query';

import { analytics } from '@shared/utils/analytics';

import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentTaprootAccount } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

import { Inscription } from './inscription';

interface OrdinalsProps {
  setIsLoadingMore(isLoading: boolean): void;
}
export function Ordinals({ setIsLoadingMore }: OrdinalsProps) {
  const account = useCurrentTaprootAccount();
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();

  const result = useInscriptions({
    taprootKeychain: account?.keychain,
    nativeSegwitAddress: nativeSegwitSigner.address,
  });

  const { ref: intersectionSentinel, inView } = useInView({
    rootMargin: '0% 0% 20% 0%',
  });

  useEffect(() => {
    async function fetchNextPage() {
      if (!result.hasNextPage || result.isLoading || result.isFetchingNextPage) return;
      try {
        setIsLoadingMore(true);
        await result.fetchNextPage();
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
  }, [inView, result, setIsLoadingMore]);

  useEffect(() => {
    const inscriptionsLength = result.inscriptions.length || 0;
    if (inscriptionsLength > 0) {
      void analytics.track('view_collectibles', {
        ordinals_count: inscriptionsLength,
      });
      void analytics.identify({ ordinals_count: inscriptionsLength });
    }
  }, [result.inscriptions.length]);

  if (!result.inscriptions) return null;

  return (
    <>
      {result.inscriptions.map(inscription => (
        <Inscription inscription={inscription} key={inscription.id} />
      ))}
      <Box ref={intersectionSentinel} />
    </>
  );
}

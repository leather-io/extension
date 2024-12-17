import { useEffect } from 'react';

import { analytics } from '@shared/utils/analytics';

import { useInscriptions } from '@app/query/bitcoin/ordinals/inscriptions/inscriptions.query';
import { useCurrentBitcoinAccountXpubs } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';

import { Inscription } from './inscription';

export function Ordinals() {
  const xpubs = useCurrentBitcoinAccountXpubs();
  const results = useInscriptions({ xpubs });

  useEffect(() => {
    if (!results.inscriptions) return;
    const inscriptionsLength = results.inscriptions.length;
    if (inscriptionsLength > 0) {
      void analytics.track('view_collectibles', {
        ordinals_count: inscriptionsLength,
      });
    }
    void analytics.identify({ ordinals_count: inscriptionsLength });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results.inscriptions?.length]);

  if (results.isLoading) return null;

  return results.inscriptions.map(inscription => (
    <Inscription inscription={inscription} key={inscription.id} />
  ));
}

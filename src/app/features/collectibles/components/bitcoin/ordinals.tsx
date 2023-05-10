import { useEffect } from 'react';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useGetInscriptionsQuery } from '@app/query/bitcoin/ordinals/use-inscriptions.query';

import { Inscription } from './inscription';

export function Ordinals() {
  const { data: inscriptions = [] } = useGetInscriptionsQuery();
  const analytics = useAnalytics();

  useEffect(() => {
    if (inscriptions.length > 0) {
      void analytics.track('view_collectibles', {
        ordinals_count: inscriptions.length,
      });
      void analytics.identify({ ordinals_count: inscriptions.length });
    }
  }, [inscriptions.length, analytics]);

  return (
    <>
      {inscriptions.map(inscription => (
        <Inscription rawInscription={inscription} key={inscription.id} />
      ))}
    </>
  );
}

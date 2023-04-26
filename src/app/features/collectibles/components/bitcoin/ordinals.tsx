import { useEffect } from 'react';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { InscriptionLoader } from '@app/components/inscription-loader';
import { useTaprootAccountUtxosQuery } from '@app/query/bitcoin/ordinals/use-taproot-address-utxos.query';

import { Inscription } from './inscription';

export function Ordinals() {
  const { data: utxos = [] } = useTaprootAccountUtxosQuery();
  const analytics = useAnalytics();

  useEffect(() => {
    if (utxos.length > 0) {
      void analytics.track('view_collectibles', {
        ordinals_count: utxos.length,
      });
      void analytics.identify({ ordinals_count: utxos.length });
    }
  }, [utxos.length, analytics]);

  return (
    <>
      {utxos.map(utxo => (
        <InscriptionLoader key={utxo.txid + utxo.vout} utxo={utxo}>
          {path => <Inscription path={path} utxo={utxo} />}
        </InscriptionLoader>
      ))}
    </>
  );
}

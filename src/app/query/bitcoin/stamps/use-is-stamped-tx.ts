import { useCallback } from 'react';

import { useStampCollectionQuery } from './stamp-collection.query';

export function useIsStampedTx() {
  const { data: stampCollection = [] } = useStampCollectionQuery();

  return useCallback(
    (txid: string) => stampCollection.some(stamp => stamp.tx_hash === txid),
    [stampCollection]
  );
}

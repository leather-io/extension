import { useCallback } from 'react';

import { InscriptionResponseItem } from '@shared/models/inscription.model';
import { isUndefined } from '@shared/utils';

import { useGetInscriptionsInfiniteQuery } from './inscriptions.query';

interface FindInscriptionsOnUtxoArgs {
  index: number;
  inscriptions: InscriptionResponseItem[];
  txId: string;
}
export function findInscriptionsOnUtxo({ index, inscriptions, txId }: FindInscriptionsOnUtxoArgs) {
  return inscriptions?.filter(inscription => {
    return `${txId}:${index.toString()}` === inscription.output;
  });
}

export function useNumberOfInscriptionsOnUtxo() {
  const query = useGetInscriptionsInfiniteQuery();
  const inscriptions = query.data?.pages?.flatMap(page => page.inscriptions);

  return useCallback(
    (txId: string, index: number) => {
      if (isUndefined(inscriptions)) return 0;
      const foundInscriptionsOnUtxo = findInscriptionsOnUtxo({ index, inscriptions, txId });
      if (isUndefined(foundInscriptionsOnUtxo)) return 0;
      return foundInscriptionsOnUtxo?.length;
    },
    [inscriptions]
  );
}

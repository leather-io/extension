import { useIsFetching } from '@tanstack/react-query';

import { QueryPrefixes } from '@leather-wallet/query';
import { sumNumbers } from '@leather-wallet/utils';

function areAnyQueriesFetching(...args: number[]) {
  return sumNumbers(args).toNumber() > 0;
}

export function useIsFetchingCollectiblesRelatedQuery() {
  // Ordinal inscriptions
  const n1 = useIsFetching([QueryPrefixes.TaprootAddressUtxos]);
  const n2 = useIsFetching([QueryPrefixes.InscriptionsByAddress]);
  const n3 = useIsFetching([QueryPrefixes.InscriptionMetadata]);
  const n4 = useIsFetching([QueryPrefixes.OrdinalTextContent]);
  const n5 = useIsFetching([QueryPrefixes.GetInscriptions]);

  // BNS
  const n6 = useIsFetching([QueryPrefixes.BnsNamesByAddress]);

  // NFTs
  const n7 = useIsFetching([QueryPrefixes.GetNftMetadata]);

  return areAnyQueriesFetching(n1, n2, n3, n4, n5, n6, n7);
}

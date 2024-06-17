import { useIsFetching } from '@tanstack/react-query';

import { QueryPrefixes } from '@leather-wallet/query';
import { sumNumbers } from '@leather-wallet/utils';

function areAnyQueriesFetching(...args: number[]) {
  return sumNumbers(args).toNumber() > 0;
}

export function useIsFetchingCollectiblesRelatedQuery() {
  // Ordinal inscriptions
  const n1 = useIsFetching({ queryKey: [QueryPrefixes.TaprootAddressUtxos] });
  const n2 = useIsFetching({ queryKey: [QueryPrefixes.InscriptionsByAddress] });
  const n3 = useIsFetching({ queryKey: [QueryPrefixes.InscriptionMetadata] });
  const n4 = useIsFetching({ queryKey: [QueryPrefixes.OrdinalTextContent] });
  const n5 = useIsFetching({ queryKey: [QueryPrefixes.GetInscriptions] });

  // BNS
  const n6 = useIsFetching({ queryKey: [QueryPrefixes.BnsNamesByAddress] });

  // NFTs
  const n7 = useIsFetching({ queryKey: [QueryPrefixes.GetNftMetadata] });

  return areAnyQueriesFetching(n1, n2, n3, n4, n5, n6, n7);
}

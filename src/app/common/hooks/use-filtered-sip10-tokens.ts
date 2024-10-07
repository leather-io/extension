import { useMemo } from 'react';

import {
  type Sip10CryptoAssetFilter,
  filterSip10Tokens,
  useAlexSwappableAssets,
  useFilteredSip10Tokens,
} from '@leather.io/query';

import { useBitflowSwappableAssets } from '@app/pages/swap/hooks/use-bitflow-swappable-assets';

interface UseSip10TokensArgs {
  address: string;
  filter?: Sip10CryptoAssetFilter;
}
// TODO: Migrate to mono
export function useCombinedFilteredSip10Tokens({ address, filter = 'all' }: UseSip10TokensArgs) {
  const { isLoading, tokens = [] } = useFilteredSip10Tokens({ address });
  const { data: alexSwapAssets = [] } = useAlexSwappableAssets(address);
  const { data: bitflowSwapAssets = [] } = useBitflowSwappableAssets(address);
  const filteredTokens = useMemo(
    () => filterSip10Tokens([...alexSwapAssets, ...bitflowSwapAssets], tokens, filter),
    [alexSwapAssets, bitflowSwapAssets, tokens, filter]
  );
  return { isLoading, tokens: filteredTokens };
}

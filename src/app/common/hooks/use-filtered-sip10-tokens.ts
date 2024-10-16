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
export function useCombinedFilteredSip10Tokens({ address }: UseSip10TokensArgs) {
  const { isLoading, tokens = [] } = useFilteredSip10Tokens({ address });
  const { data: alexSwapAssets = [] } = useAlexSwappableAssets(address);
  const { data: bitflowSwapAssets = [] } = useBitflowSwappableAssets(address);

  const filteredTokens = useMemo(() => {
    const assets = [...alexSwapAssets, ...bitflowSwapAssets];
    return {
      allTokens: filterSip10Tokens(assets, tokens, 'all'),
      supportedTokens: filterSip10Tokens(assets, tokens, 'supported'),
      unsupportedTokens: filterSip10Tokens(assets, tokens, 'unsupported'),
    };
  }, [alexSwapAssets, bitflowSwapAssets, tokens]);

  return { isLoading, ...filteredTokens };
}

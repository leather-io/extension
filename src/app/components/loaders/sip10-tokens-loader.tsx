import { type Sip10TokenAssetDetails } from '@leather.io/query';

import { useCombinedFilteredSip10Tokens } from '@app/common/hooks/use-filtered-sip10-tokens';
import { type AssetFilter, useManageTokens } from '@app/common/hooks/use-manage-tokens';

interface Sip10TokensLoaderProps {
  address: string;
  assetFilter?: AssetFilter;

  children({
    isLoading,
    tokens,
    preEnabledTokensIds,
  }: {
    isLoading: boolean;
    tokens: Sip10TokenAssetDetails[];
    preEnabledTokensIds: string[];
  }): React.ReactNode;
}

function getTokenId(token: Sip10TokenAssetDetails) {
  return token.info.contractId;
}

export function Sip10TokensLoader({
  address,
  assetFilter = 'all',
  children,
}: Sip10TokensLoaderProps) {
  const {
    isLoading,
    allTokens = [],
    supportedTokens,
  } = useCombinedFilteredSip10Tokens({ address, filter: 'all' });

  const { filterTokens } = useManageTokens();
  const preEnabledTokensIds = supportedTokens.map(t => t.info.contractId);
  const filteredTokens = filterTokens({
    tokens: allTokens,
    filter: assetFilter,
    getTokenId,
    preEnabledTokensIds,
  });

  return children({ isLoading, tokens: filteredTokens, preEnabledTokensIds });
}

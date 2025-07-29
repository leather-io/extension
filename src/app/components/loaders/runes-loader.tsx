import type { CryptoAssetBalance, MarketData, RuneAsset } from '@leather.io/models';

import { type AssetFilter, useManageTokens } from '@app/common/hooks/use-manage-tokens';
import { useRuneTokens } from '@app/query/bitcoin/runes/runes.hooks';

interface RunesLoaderProps {
  addresses: string[];
  children({
    tokens,
    preEnabledTokensIds,
  }: {
    tokens: RuneTokenItem[];
    preEnabledTokensIds: string[];
  }): React.ReactNode;
  filter?: AssetFilter;
}

interface RuneTokenItem {
  balance: CryptoAssetBalance;
  info: RuneAsset;
  marketData: MarketData;
}

function getTokenId(token: RuneTokenItem) {
  return token.info.runeName;
}

export function RunesLoader({ addresses, children, filter = 'all' }: RunesLoaderProps) {
  const { runes = [] } = useRuneTokens(addresses);

  const { filterTokens } = useManageTokens();

  const preEnabledTokensIds: string[] = [];
  const filteredTokens = filterTokens({
    tokens: runes,
    filter,
    getTokenId,
    preEnabledTokensIds,
  });

  return children({ tokens: filteredTokens, preEnabledTokensIds });
}

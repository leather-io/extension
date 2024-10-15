import type { Brc20CryptoAssetInfo, CryptoAssetBalance, MarketData } from '@leather.io/models';

import { type AssetFilter, useManageTokens } from '@app/common/hooks/use-manage-tokens';
import { useBrc20Tokens } from '@app/query/bitcoin/ordinals/brc20/brc20-tokens.hooks';

interface Brc20TokenItem {
  balance: CryptoAssetBalance;
  info: Brc20CryptoAssetInfo;
  holderAddress: string;
  marketData: MarketData;
}

interface Brc20TokensLoaderProps {
  filter?: AssetFilter;
  children({
    tokens,
    preEnabledTokensIds,
  }: {
    tokens: Brc20TokenItem[];
    preEnabledTokensIds: string[];
  }): React.ReactNode;
}

function getTokenId(token: Brc20TokenItem) {
  return token.info.symbol;
}
export function Brc20TokensLoader({ children, filter = 'all' }: Brc20TokensLoaderProps) {
  const tokens = useBrc20Tokens();

  const { filterTokens } = useManageTokens();

  const preEnabledTokensIds = tokens
    .filter(t => t.marketData.price.amount.isGreaterThan(0))
    .map(t => t.info.symbol);

  const filteredTokens = filterTokens({
    tokens,
    filter,
    getTokenId,
    preEnabledTokensIds,
  });

  return children({ tokens: filteredTokens, preEnabledTokensIds });
}

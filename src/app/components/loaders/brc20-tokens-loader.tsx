import type { Brc20CryptoAssetInfo, CryptoAssetBalance, MarketData } from '@leather.io/models';

import { type AssetFilter, filterTokens } from '@app/common/filter-tokens';
import { useBrc20Tokens } from '@app/query/bitcoin/ordinals/brc20/brc20-tokens.hooks';
import { type TokenUserSetting } from '@app/store/manage-tokens/manage-tokens.slice';

interface Brc20Token {
  balance: CryptoAssetBalance;
  info: Brc20CryptoAssetInfo;
  holderAddress: string;
  marketData: MarketData;
}
interface Brc20TokensLoaderProps {
  children(tokens: Brc20Token[]): React.ReactNode;
  accountIndex: number;
  userSetTokens: TokenUserSetting[];
  filter?: AssetFilter;
}

export function Brc20TokensLoader({
  accountIndex,
  userSetTokens,
  children,
  filter = 'all',
}: Brc20TokensLoaderProps) {
  const tokens = useBrc20Tokens();
  const getTokenIdentifier = (token: Brc20Token) => token.info.symbol;
  const filteredTokens = filterTokens({
    tokens,
    accountIndex,
    userSetTokens,
    filter,
    getTokenIdentifier,
  });
  return children(filteredTokens);
}

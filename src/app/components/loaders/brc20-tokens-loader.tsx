import type { Brc20CryptoAssetInfo, CryptoAssetBalance, MarketData } from '@leather.io/models';

import { useBrc20Tokens } from '@app/query/bitcoin/ordinals/brc20/brc20-tokens.hooks';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useAllTokens } from '@app/store/manage-tokens/manage-tokens.slice';
import { filterTokens, type AssetFilter } from '@app/common/filter-tokens';

interface Brc20Token {
  balance: CryptoAssetBalance;
  info: Brc20CryptoAssetInfo;
  holderAddress: string;
  marketData: MarketData;
}
interface Brc20TokensLoaderProps {
  children(tokens: Brc20Token[]): React.ReactNode;
  filter?: AssetFilter;
}

export function Brc20TokensLoader({ children, filter = 'all' }: Brc20TokensLoaderProps) {
  const tokens = useBrc20Tokens();
  const accountIndex = useCurrentAccountIndex();
  const allTokens = useAllTokens();
  const getTokenIdentifier = (token: Brc20Token) => token.info.symbol;
  const filteredTokens = filterTokens({
    tokens,
    accountIndex,
    allTokens,
    filter,
    getTokenIdentifier,
  });
  return children(filteredTokens);
}

import type { CryptoAssetBalance, Stx20CryptoAssetInfo } from '@leather.io/models';
import { useStx20Tokens } from '@leather.io/query';

import { type AssetFilter, useManageTokens } from '@app/common/hooks/use-manage-tokens';

interface Stx20TokensLoaderProps {
  address: string;
  filter?: AssetFilter;
  children({
    tokens,
    preEnabledTokensIds,
  }: {
    tokens: Stx20TokenItem[];
    preEnabledTokensIds: string[];
  }): React.ReactNode;
}

interface Stx20TokenItem {
  balance: CryptoAssetBalance;
  info: Stx20CryptoAssetInfo;
}

function getTokenId(token: Stx20TokenItem) {
  return token.info.symbol;
}

function castFullTokenInfo(rawToken: Partial<Stx20CryptoAssetInfo>) {
  return {
    chain: rawToken.chain!,
    category: rawToken.category!,
    protocol: rawToken.protocol!,
    symbol: rawToken.symbol!,
    decimals: rawToken.decimals!,
    hasMemo: rawToken.hasMemo!,
  };
}

export function Stx20TokensLoader({ address, children, filter = 'all' }: Stx20TokensLoaderProps) {
  const { data: tokens = [] } = useStx20Tokens(address);
  const { filterTokens } = useManageTokens();
  const preEnabledTokensIds: string[] = [];
  const filteredTokens = filterTokens({
    tokens: tokens.map(t => ({ ...t, info: castFullTokenInfo(t.info) })),
    filter,
    getTokenId,
    preEnabledTokensIds,
  });
  return children({ tokens: filteredTokens, preEnabledTokensIds });
}

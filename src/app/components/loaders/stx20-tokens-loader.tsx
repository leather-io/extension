import type { CryptoAssetBalance, Stx20Asset } from '@leather.io/models';

import { type AssetFilter, useManageTokens } from '@app/common/hooks/use-manage-tokens';
import { useStx20Tokens } from '@app/query/stacks/stx20/stx20-tokens.hooks';

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
  info: Stx20Asset;
}

function getTokenId(token: Stx20TokenItem) {
  return token.info.symbol;
}

function castFullTokenInfo(rawToken: Partial<Stx20Asset>) {
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

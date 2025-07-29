import type { CryptoAssetBalance, Src20Asset } from '@leather.io/models';

import { type AssetFilter, useManageTokens } from '@app/common/hooks/use-manage-tokens';
import { useSrc20TokensByAddress } from '@app/query/bitcoin/stamps/stamps-by-address.hooks';

export interface Src20TokenAssetDetails {
  balance: CryptoAssetBalance;
  info: Src20Asset;
}

interface Src20TokensLoaderProps {
  address: string;
  filter?: AssetFilter;

  children({
    tokens,
    preEnabledTokensIds,
  }: {
    tokens: Src20TokenAssetDetails[];
    preEnabledTokensIds: string[];
  }): React.ReactNode;
}

function getTokenId(token: Src20TokenAssetDetails) {
  return token.info.symbol;
}

export function Src20TokensLoader({ address, children, filter = 'all' }: Src20TokensLoaderProps) {
  const { data: tokens = [] } = useSrc20TokensByAddress(address);
  const { filterTokens } = useManageTokens();
  const preEnabledTokensIds = tokens.map(t => t.info.symbol);

  const filteredTokens = filterTokens({
    tokens,
    filter,
    getTokenId,
    preEnabledTokensIds,
  });
  return children({ tokens: filteredTokens, preEnabledTokensIds });
}

import type { CryptoAssetBalance, Sip10CryptoAssetInfo } from '@leather.io/models';
import {
  type Sip10CryptoAssetFilter,
  type Sip10TokenAssetDetails,
  useAlexSwappableAssets,
  useFilteredSip10Tokens,
} from '@leather.io/query';

import { filterTokens, sortTokensBySwapability } from '@app/common/filter-tokens';
import { type TokenUserSetting } from '@app/store/manage-tokens/manage-tokens.slice';

interface Token {
  balance: CryptoAssetBalance;
  info: Sip10CryptoAssetInfo;
}
[];

interface Sip10TokensLoaderProps {
  address: string;
  filter: Sip10CryptoAssetFilter;
  accountIndex: number;
  userSetTokens: TokenUserSetting[];
  children(isLoading: boolean, tokens: Sip10TokenAssetDetails[]): React.ReactNode;
}
export function Sip10TokensLoader({
  accountIndex,
  userSetTokens,
  address,
  filter,
  children,
}: Sip10TokensLoaderProps) {
  const { isLoading, tokens = [] } = useFilteredSip10Tokens({ address, filter: 'all' });
  const { data: swapAssets = [] } = useAlexSwappableAssets(address);
  const getTokenIdentifier = (token: Token) => token.info.contractId;
  const filteredTokens = filterTokens({
    tokens,
    accountIndex,
    userSetTokens,
    filter,
    getTokenIdentifier,
  });

  if (filter === 'all') {
    sortTokensBySwapability({ tokens: filteredTokens, swapAssets, getTokenIdentifier });
  }
  return children(isLoading, filteredTokens);
}

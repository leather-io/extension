import type { CryptoAssetBalance, Sip10CryptoAssetInfo } from '@leather.io/models';
import {
  type Sip10CryptoAssetFilter,
  type Sip10TokenAssetDetails,
  useAlexSwappableAssets,
  useFilteredSip10Tokens,
} from '@leather.io/query';

import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useAllTokens } from '@app/store/manage-tokens/manage-tokens.slice';
import { filterTokens, sortTokensBySwappability } from '@app/common/filter-tokens';

interface Token {
  balance: CryptoAssetBalance;
  info: Sip10CryptoAssetInfo;
}
[];

interface Sip10TokensLoaderProps {
  address: string;
  filter: Sip10CryptoAssetFilter;
  children(isLoading: boolean, tokens: Sip10TokenAssetDetails[]): React.ReactNode;
}
export function Sip10TokensLoader({ address, filter, children }: Sip10TokensLoaderProps) {
  const { isLoading, tokens = [] } = useFilteredSip10Tokens({ address, filter: 'all' });
  const { data: swapAssets = [] } = useAlexSwappableAssets(address);
  const accountIndex = useCurrentAccountIndex();
  const allTokens = useAllTokens();
  const getTokenIdentifier = (token: Token) => token.info.contractId;
  const filteredTokens = filterTokens({
    tokens,
    accountIndex,
    allTokens,
    filter,
    getTokenIdentifier,
  });

  if (filter === 'all') {
    sortTokensBySwappability({tokens: filteredTokens, swapAssets, getTokenIdentifier})
  }
  return children(isLoading, filteredTokens);
}

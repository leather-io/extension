import type { CryptoAssetBalance, Sip10CryptoAssetInfo } from '@leather.io/models';
import {
  type Sip10CryptoAssetFilter,
  type Sip10TokenAssetDetails,
  useAlexSwappableAssets,
  useFilteredSip10Tokens,
} from '@leather.io/query';
import { getPrincipalFromContractId } from '@leather.io/utils';

import { filterTokens } from '@app/common/utils';

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
  let { isLoading, tokens = [] } = useFilteredSip10Tokens({ address, filter: 'all' });
  const { data: swapAssets = [] } = useAlexSwappableAssets(address);
  const getTokenIdentifier = (token: Token) => token.info.contractId;
  const filteredTokens = filterTokens({ tokens, filter, getTokenIdentifier }) as Token[];

  if (filter === 'all') {
    // sort alex swappable tokens first for good ux
    filteredTokens.sort((a, b) => {
      const aPrincipal = getPrincipalFromContractId(getTokenIdentifier(a));
      const bPrincipal = getPrincipalFromContractId(getTokenIdentifier(b));
      return (
        Number(swapAssets.some(swapAsset => swapAsset.principal === bPrincipal)) -
        Number(swapAssets.some(swapAsset => swapAsset.principal === aPrincipal))
      );
    });
  }
  return children(isLoading, filteredTokens);
}

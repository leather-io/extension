import type { CryptoAssetBalance, Src20CryptoAssetInfo } from '@leather.io/models';
import { useSrc20TokensByAddress } from '@leather.io/query';

import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useAllTokens } from '@app/store/manage-tokens/manage-tokens.slice';
import { filterTokens, type AssetFilter } from '@app/common/filter-tokens';

export interface Src20TokenAssetDetails {
  balance: CryptoAssetBalance;
  info: Src20CryptoAssetInfo;
}

interface Src20TokensLoaderProps {
  address: string;
  children(tokens: Src20TokenAssetDetails[]): React.ReactNode;
  filter?: AssetFilter;
}
export function Src20TokensLoader({ address, children, filter = 'all' }: Src20TokensLoaderProps) {
  const { data: tokens = [] } = useSrc20TokensByAddress(address);
  const accountIndex = useCurrentAccountIndex();
  const allTokens = useAllTokens();
  const getTokenIdentifier = (token: Src20TokenAssetDetails) => token.info.symbol;
  return children(filterTokens({ tokens, accountIndex, allTokens, filter, getTokenIdentifier }));
}

import type { CryptoAssetBalance, MarketData, Sip10CryptoAssetInfo } from '@leather-wallet/models';

import { useFilteredSip10Tokens } from '@app/query/stacks/sip10/sip10-tokens.hooks';
import type { Sip10CryptoAssetFilter } from '@app/query/stacks/sip10/sip10-tokens.utils';

interface Sip10TokensLoaderProps {
  address: string;
  filter: Sip10CryptoAssetFilter;
  children(
    tokens: {
      assetInfo: Sip10CryptoAssetInfo;
      balance: CryptoAssetBalance;
      marketData: MarketData;
    }[]
  ): React.ReactNode;
}
export function Sip10TokensLoader({ address, filter, children }: Sip10TokensLoaderProps) {
  const tokens = useFilteredSip10Tokens({ address, filter });
  return children(tokens);
}

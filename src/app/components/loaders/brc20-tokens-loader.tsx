import type { Brc20CryptoAssetInfo, CryptoAssetBalance, MarketData } from '@leather-wallet/models';

import { useBrc20Tokens } from '@app/query/bitcoin/ordinals/brc20/brc20-tokens.hooks';

interface Brc20TokensLoaderProps {
  children(
    tokens: {
      balance: CryptoAssetBalance;
      info: Brc20CryptoAssetInfo;
      holderAddress: string;
      marketData: MarketData;
    }[]
  ): React.ReactNode;
}
export function Brc20TokensLoader({ children }: Brc20TokensLoaderProps) {
  const tokens = useBrc20Tokens();
  return children(tokens);
}

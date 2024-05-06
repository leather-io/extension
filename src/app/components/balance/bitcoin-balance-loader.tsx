import { useNativeSegwitBalance } from '@leather-wallet/query';

import { BitcoinCryptoCurrencyAssetBalance } from '@shared/models/crypto-asset-balance.model';

interface BitcoinBalanceLoaderProps {
  address: string;
  children(balance: BitcoinCryptoCurrencyAssetBalance, isInitialLoading: boolean): React.ReactNode;
}

export function BitcoinBalanceLoader({ address, children }: BitcoinBalanceLoaderProps) {
  const { btcBalance, isInitialLoading } = useNativeSegwitBalance(address);
  return children(btcBalance, isInitialLoading);
}

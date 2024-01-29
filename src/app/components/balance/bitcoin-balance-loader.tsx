import { BitcoinCryptoCurrencyAssetBalance } from '@shared/models/crypto-asset-balance.model';

import { useNativeSegwitBalance } from '@app/query/bitcoin/balance/btc-native-segwit-balance.hooks';

interface BitcoinBalanceLoaderProps {
  address: string;
  children(balance: BitcoinCryptoCurrencyAssetBalance): React.ReactNode;
}

export function BitcoinBalanceLoader({ address, children }: BitcoinBalanceLoaderProps) {
  const btcCryptoCurrencyAssetBalance = useNativeSegwitBalance(address);
  return children(btcCryptoCurrencyAssetBalance);
}

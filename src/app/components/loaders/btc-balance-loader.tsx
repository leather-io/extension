import { BtcCryptoAssetBalance } from '@leather-wallet/models';

import { useNativeSegwitBtcCryptoAssetBalance } from '@app/query/bitcoin/balance/btc-native-segwit-balance.hooks';

interface BtcBalanceLoaderProps {
  address: string;
  children(balance: BtcCryptoAssetBalance, isInitialLoading: boolean): React.ReactNode;
}
export function BtcBalanceLoader({ address, children }: BtcBalanceLoaderProps) {
  const { btcCryptoAssetBalance, isInitialLoading } = useNativeSegwitBtcCryptoAssetBalance(address);
  return children(btcCryptoAssetBalance, isInitialLoading);
}

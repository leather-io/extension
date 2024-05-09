import { BtcCryptoAssetBalance } from '@leather-wallet/models';

import { useBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';

interface BtcBalanceLoaderProps {
  address: string;
  children(balance: BtcCryptoAssetBalance, isInitialLoading: boolean): React.ReactNode;
}
export function BtcBalanceLoader({ address, children }: BtcBalanceLoaderProps) {
  const { btcCryptoAssetBalance, isInitialLoading } = useBtcCryptoAssetBalanceNativeSegwit(address);
  return children(btcCryptoAssetBalance, isInitialLoading);
}

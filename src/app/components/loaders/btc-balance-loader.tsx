import type { BtcCryptoAssetBalance } from '@leather.io/models';
import { isFetchedWithSuccess, isInitializingData } from '@leather.io/query';
import { BtcAvatarIcon } from '@leather.io/ui';

import { useBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';

import { CryptoAssetItemError } from '../crypto-asset-item/crypto-asset-item-error';
import { CryptoAssetItemPlaceholder } from '../crypto-asset-item/crypto-asset-item-placeholder';

interface BtcBalanceLoaderProps {
  address: string;
  children(balance: BtcCryptoAssetBalance, isInitialLoading: boolean): React.ReactNode;
}
export function BtcBalanceLoader({ address, children }: BtcBalanceLoaderProps) {
  const { balance, query: result } = useBtcCryptoAssetBalanceNativeSegwit(address);
  if (isInitializingData(result)) return <CryptoAssetItemPlaceholder />;
  if (!isFetchedWithSuccess(result))
    return <CryptoAssetItemError caption="BTC" icon={<BtcAvatarIcon />} title="Bitcoin" />;
  return children(balance, result.isInitialLoading);
}

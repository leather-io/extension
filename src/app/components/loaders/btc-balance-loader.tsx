import type { BtcCryptoAssetBalance } from '@leather-wallet/models';
import { isFetchedWithSuccess, isInitializingData } from '@leather-wallet/query';

import { useBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';
import { BtcAvatarIcon } from '@app/ui/components/avatar/btc-avatar-icon';

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

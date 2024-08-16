import type { BtcCryptoAssetBalance } from '@leather.io/models';
import { BtcAvatarIcon } from '@leather.io/ui';

import { useBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';

import { CryptoAssetItemError } from '../crypto-asset-item/crypto-asset-item-error';
import { CryptoAssetItemPlaceholder } from '../crypto-asset-item/crypto-asset-item-placeholder';

interface BtcBalanceLoaderProps {
  address: string;
  children(balance: BtcCryptoAssetBalance): React.ReactNode;
}
export function BtcBalanceLoader({ address, children }: BtcBalanceLoaderProps) {
  const { balance } = useBtcCryptoAssetBalanceNativeSegwit(address);
  return children(balance);
}

interface BtcAssetItemBalanceLoaderProps {
  address: string;
  children(
    balance: BtcCryptoAssetBalance,
    isLoading: boolean,
    isLoadingAdditionalData: boolean
  ): React.ReactNode;
}
export function BtcAssetItemBalanceLoader({ address, children }: BtcAssetItemBalanceLoaderProps) {
  const { balance, filteredUtxosQuery, isLoading, isLoadingAdditionalData } =
    useBtcCryptoAssetBalanceNativeSegwit(address);
  if (isLoading) return <CryptoAssetItemPlaceholder />;
  if (filteredUtxosQuery.isError)
    return <CryptoAssetItemError caption="BTC" icon={<BtcAvatarIcon />} title="Bitcoin" />;
  return children(balance, isLoading, isLoadingAdditionalData);
}

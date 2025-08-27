import type { AccountQuotedBtcBalance } from '@leather.io/services';
import { BtcAvatarIcon } from '@leather.io/ui';

import { useNativeSegwitBtcAccountBalance } from '@app/query/bitcoin/balance/btc-balance.hooks';

import { CryptoAssetItemError } from '../crypto-asset-item/crypto-asset-item-error';
import { CryptoAssetItemPlaceholder } from '../crypto-asset-item/crypto-asset-item-placeholder';

interface BtcAssetItemBalanceLoaderProps {
  accountIndex: number;
  children(
    balance: AccountQuotedBtcBalance,
    isLoading: boolean,
    isLoadingAdditionalData: boolean
  ): React.ReactNode;
}
export function BtcAssetItemBalanceLoader({
  accountIndex,
  children,
}: BtcAssetItemBalanceLoaderProps) {
  const nativeSegwitBalance = useNativeSegwitBtcAccountBalance(accountIndex);
  const isLoading = nativeSegwitBalance.state === 'loading';
  if (isLoading) return <CryptoAssetItemPlaceholder />;
  if (nativeSegwitBalance.state === 'error') {
    return <CryptoAssetItemError caption="BTC" icon={<BtcAvatarIcon />} title="Bitcoin" />;
  }

  return children(nativeSegwitBalance.value, isLoading, false);
}

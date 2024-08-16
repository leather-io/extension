import type { StxCryptoAssetBalance } from '@leather.io/models';
import {
  isErrorTooManyRequests,
  isFetchedWithSuccess,
  useStxCryptoAssetBalance,
} from '@leather.io/query';
import { StxAvatarIcon } from '@leather.io/ui';

import { CryptoAssetItemError } from '../crypto-asset-item/crypto-asset-item-error';
import { CryptoAssetItemPlaceholder } from '../crypto-asset-item/crypto-asset-item-placeholder';

interface StxAssetItemBalanceLoaderProps {
  address: string;
  children(
    balance: StxCryptoAssetBalance,
    isLoading: boolean,
    isLoadingAdditionalData: boolean
  ): React.ReactNode;
}
export function StxAssetItemBalanceLoader({ address, children }: StxAssetItemBalanceLoaderProps) {
  const { initialBalanceQuery, filteredBalanceQuery, isLoadingAdditionalData } =
    useStxCryptoAssetBalance(address);

  async function refetchAll() {
    await initialBalanceQuery.refetch();
    return filteredBalanceQuery.refetch();
  }

  if (initialBalanceQuery.isLoading) return <CryptoAssetItemPlaceholder />;

  if (isErrorTooManyRequests(filteredBalanceQuery)) {
    return (
      <CryptoAssetItemError
        caption="STX"
        icon={<StxAvatarIcon />}
        onRefetch={() => refetchAll()}
        title="Stacks"
      />
    );
  }

  if (!isFetchedWithSuccess(filteredBalanceQuery)) {
    return <CryptoAssetItemError caption="STX" icon={<StxAvatarIcon />} title="Stacks" />;
  }

  const { data: balance, isLoading } = filteredBalanceQuery;

  return children(balance, isLoading, isLoadingAdditionalData);
}

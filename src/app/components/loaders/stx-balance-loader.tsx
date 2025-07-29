import type { StxBalance } from '@leather.io/models';
import { isErrorTooManyRequests, isFetchedWithSuccess } from '@leather.io/query';
import { StxAvatarIcon } from '@leather.io/ui';

import { useStxCryptoAssetBalance } from '@app/query/stacks/balance/account-balance.hooks';

import { CryptoAssetItemError } from '../crypto-asset-item/crypto-asset-item-error';
import { CryptoAssetItemPlaceholder } from '../crypto-asset-item/crypto-asset-item-placeholder';

interface StxBalanceLoaderProps {
  address: string;
  children(
    balance: StxBalance,
    isLoading: boolean,
    isLoadingAdditionalData: boolean
  ): React.ReactNode;
}
export function StxBalanceLoader({ address, children }: StxBalanceLoaderProps) {
  const { filteredBalanceQuery, isLoadingAdditionalData } = useStxCryptoAssetBalance(address);
  const { data: balance, isLoading } = filteredBalanceQuery;
  if (!balance) return;
  return children(balance, isLoading, isLoadingAdditionalData);
}

export function StxAssetItemBalanceLoader({ address, children }: StxBalanceLoaderProps) {
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

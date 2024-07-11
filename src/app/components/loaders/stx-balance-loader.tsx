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
  children(balance: StxCryptoAssetBalance, isLoading: boolean): React.ReactNode;
}
export function StxAssetItemBalanceLoader({ address, children }: StxAssetItemBalanceLoaderProps) {
  const result = useStxCryptoAssetBalance(address);
  if (result.isLoading) return <CryptoAssetItemPlaceholder />;
  if (isErrorTooManyRequests(result))
    return (
      <CryptoAssetItemError
        caption="STX"
        icon={<StxAvatarIcon />}
        onRefetch={() => result.refetch()}
        title="Stacks"
      />
    );
  if (!isFetchedWithSuccess(result))
    return <CryptoAssetItemError caption="STX" icon={<StxAvatarIcon />} title="Stacks" />;
  const { data: balance, isLoading } = result;
  return children(balance, isLoading);
}

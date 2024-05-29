import type { StxCryptoAssetBalance } from '@leather-wallet/models';
import { useStxCryptoAssetBalance } from '@leather-wallet/query';

import { isFetchedWithSuccess } from '@app/query/query-config';

interface StxBalanceLoaderProps {
  address: string;
  children(balance: StxCryptoAssetBalance, isInitialLoading: boolean): React.ReactNode;
}
export function StxBalanceLoader({ address, children }: StxBalanceLoaderProps) {
  const result = useStxCryptoAssetBalance(address);
  if (!isFetchedWithSuccess(result)) return null;
  const { data: balance, isInitialLoading } = result;
  return children(balance, isInitialLoading);
}

import { useMemo } from 'react';

import type { AllTransferableCryptoAssetBalances } from '@shared/models/crypto-asset-balance.model';

import { useTransferableStacksFungibleTokenAssetBalances } from '@app/query/stacks/balance/stacks-ft-balances.hooks';
import { createStacksCryptoCurrencyAssetTypeWrapper } from '@app/query/stacks/balance/stacks-ft-balances.utils';
import { useCurrentStcAvailableUnlockedBalance } from '@app/query/stacks/balance/stx-balance.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

// TODO: Asset refactor: remove wrapper here
export function useAllTransferableCryptoAssetBalances(): AllTransferableCryptoAssetBalances[] {
  const account = useCurrentStacksAccount();

  const availableUnlockedBalance = useCurrentStcAvailableUnlockedBalance();
  const stxCryptoCurrencyAssetBalance = createStacksCryptoCurrencyAssetTypeWrapper(
    availableUnlockedBalance.amount
  );
  const stacksFtAssetBalances = useTransferableStacksFungibleTokenAssetBalances(
    account?.address ?? ''
  );

  return useMemo(() => {
    return [stxCryptoCurrencyAssetBalance, ...stacksFtAssetBalances];
  }, [stacksFtAssetBalances, stxCryptoCurrencyAssetBalance]);
}

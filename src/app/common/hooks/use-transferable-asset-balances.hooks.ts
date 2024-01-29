import { useMemo } from 'react';

import type { AllTransferableCryptoAssetBalances } from '@shared/models/crypto-asset-balance.model';

import { useTransferableStacksFungibleTokenAssetBalances } from '@app/query/stacks/balance/stacks-ft-balances.hooks';
import { createStacksCryptoCurrencyAssetTypeWrapper } from '@app/query/stacks/balance/stacks-ft-balances.utils';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { useStxBalance } from './balance/stx/use-stx-balance';

export function useAllTransferableCryptoAssetBalances(): AllTransferableCryptoAssetBalances[] {
  const account = useCurrentStacksAccount();

  const { availableBalance: availableStxBalance } = useStxBalance();
  const stxCryptoCurrencyAssetBalance = createStacksCryptoCurrencyAssetTypeWrapper(
    availableStxBalance.amount
  );
  const stacksFtAssetBalances = useTransferableStacksFungibleTokenAssetBalances(
    account?.address ?? ''
  );

  return useMemo(() => {
    return [stxCryptoCurrencyAssetBalance, ...stacksFtAssetBalances];
  }, [stacksFtAssetBalances, stxCryptoCurrencyAssetBalance]);
}

import { useMemo } from 'react';

import type { AllTransferableCryptoAssetBalances } from '@shared/models/crypto-asset-balance.model';

import { useNativeSegwitBalance } from '@app/query/bitcoin/balance/btc-native-segwit-balance.hooks';
import { useTransferableStacksFungibleTokenAssetBalances } from '@app/query/stacks/balance/stacks-ft-balances.hooks';
import { createStacksCryptoCurrencyAssetTypeWrapper } from '@app/query/stacks/balance/stacks-ft-balances.utils';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { useStxBalance } from './balance/stx/use-stx-balance';

export function useAllTransferableCryptoAssetBalances(): AllTransferableCryptoAssetBalances[] {
  const account = useCurrentStacksAccount();
  const currentBtcAddress = useCurrentAccountNativeSegwitAddressIndexZero();
  const btcCryptoCurrencyAssetBalance = useNativeSegwitBalance(currentBtcAddress);

  const { availableBalance: availableStxBalance } = useStxBalance();
  const stxCryptoCurrencyAssetBalance = createStacksCryptoCurrencyAssetTypeWrapper(
    availableStxBalance.amount
  );
  const stacksFtAssetBalances = useTransferableStacksFungibleTokenAssetBalances(
    account?.address ?? ''
  );

  return useMemo(() => {
    return [btcCryptoCurrencyAssetBalance, stxCryptoCurrencyAssetBalance, ...stacksFtAssetBalances];
  }, [btcCryptoCurrencyAssetBalance, stacksFtAssetBalances, stxCryptoCurrencyAssetBalance]);
}

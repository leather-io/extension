import { useMemo } from 'react';

import type { AllTransferableCryptoAssetBalances } from '@shared/models/crypto-asset-balance.model';

import { useNativeSegwitBalance } from '@app/query/bitcoin/balance/bitcoin-balances.query';
import {
  useStacksAnchoredCryptoCurrencyAssetBalance,
  useTransferableStacksFungibleTokenAssetBalances,
} from '@app/query/stacks/balance/stacks-ft-balances.hooks';
import { useCurrentBtcNativeSegwitAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

export function useAllTransferableCryptoAssetBalances(): AllTransferableCryptoAssetBalances[] {
  const account = useCurrentStacksAccount();
  const currentBtcAddress = useCurrentBtcNativeSegwitAccountAddressIndexZero();
  const btcCryptoCurrencyAssetBalance = useNativeSegwitBalance(currentBtcAddress);
  const { data: stxCryptoCurrencyAssetBalance } = useStacksAnchoredCryptoCurrencyAssetBalance(
    account?.address ?? ''
  );
  const stacksFtAssetBalances = useTransferableStacksFungibleTokenAssetBalances(
    account?.address ?? ''
  );

  return useMemo(() => {
    if (!stxCryptoCurrencyAssetBalance) return [];
    return [btcCryptoCurrencyAssetBalance, stxCryptoCurrencyAssetBalance, ...stacksFtAssetBalances];
  }, [btcCryptoCurrencyAssetBalance, stacksFtAssetBalances, stxCryptoCurrencyAssetBalance]);
}

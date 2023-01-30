import { useMemo } from 'react';

import type { AllTransferableCryptoAssetBalances } from '@shared/models/crypto-asset-balance.model';

import { useBitcoinCryptoCurrencyAssetBalance } from '@app/query/bitcoin/address/address.hooks';
import {
  useStacksAnchoredCryptoCurrencyAssetBalance,
  useTransferableStacksFungibleTokenAssetBalances,
} from '@app/query/stacks/balance/crypto-asset-balances.hooks';
import { useCurrentBtcAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/bitcoin-account.hooks';
import { useCurrentAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

export function useAllTransferableCryptoAssetBalances(): AllTransferableCryptoAssetBalances[] {
  const account = useCurrentAccount();
  // const currentAccountBtcAddress = useCurrentBtcAccount();
  const currentBtcAddress = useCurrentBtcAccountAddressIndexZero();
  const btcCryptoCurrencyAssetBalance = useBitcoinCryptoCurrencyAssetBalance(currentBtcAddress);
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

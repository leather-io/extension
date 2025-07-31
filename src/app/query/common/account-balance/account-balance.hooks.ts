import { createMoney, isDefined, sumMoney } from '@leather.io/utils';

import { useNativeSegwitBtcAccountBalance } from '@app/query/bitcoin/balance/btc-balance.hooks';
import { useManagedRunesAccountBalance } from '@app/query/bitcoin/runes/runes-balance.query';
import { useStxAccountBalance } from '@app/query/stacks/balance/stx-balance.hooks';
import { useManagedSip10AccountBalance } from '@app/query/stacks/sip10/sip10-balance.hooks';
import { useCurrentAccountIndex } from '@app/store/accounts/account';

export function useCurrentAccountBalance() {
  const accountIndex = useCurrentAccountIndex();
  return useAccountBalance(accountIndex);
}

export function useAccountBalance(accountIndex: number) {
  const zeroMoneyUsd = createMoney(0, 'USD');

  const btcAccountBalance = useNativeSegwitBtcAccountBalance(accountIndex);
  const stxAccountBalance = useStxAccountBalance(accountIndex);
  const runesAccountBalance = useManagedRunesAccountBalance(accountIndex, 'enabled');
  const sip10AccountBalance = useManagedSip10AccountBalance(accountIndex, 'enabled');

  const availableBalance = sumMoney(
    [
      zeroMoneyUsd,
      btcAccountBalance.value?.quote.availableBalance,
      stxAccountBalance.value?.quote.availableUnlockedBalance,
      sip10AccountBalance.balance?.availableBalance,
      runesAccountBalance.balance?.availableBalance,
    ].filter(isDefined)
  );
  const totalBalance = sumMoney(
    [
      zeroMoneyUsd,
      btcAccountBalance.value?.quote.totalBalance,
      stxAccountBalance.value?.quote.totalBalance,
      sip10AccountBalance.balance?.totalBalance,
      runesAccountBalance.balance?.totalBalance,
    ].filter(isDefined)
  );

  return {
    totalBalance,
    availableBalance,
    isLoading:
      btcAccountBalance.state === 'loading' &&
      stxAccountBalance.state === 'loading' &&
      sip10AccountBalance.isLoading &&
      runesAccountBalance.isLoading,
    isLoadingAdditionalData:
      btcAccountBalance.state === 'loading' ||
      stxAccountBalance.state === 'loading' ||
      sip10AccountBalance.isLoading ||
      runesAccountBalance.isLoading,
    isError: btcAccountBalance.state === 'error' || stxAccountBalance.state === 'error',
  };
}

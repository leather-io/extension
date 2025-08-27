import { createBtcBalance, createMoney } from '@leather.io/utils';

import { toFetchState } from '@app/services/fetch-state';
import { useAccountAddresses } from '@app/services/use-account-addresses';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useDiscardedInscriptions } from '@app/store/settings/settings.selectors';

import { useGetBtcAccountBalanceQuery } from './btc-balance.query';

const fallbackBtcBalance = createBtcBalance(createMoney(0, 'BTC'));
const fallbackQuoteBalance = createBtcBalance(createMoney(0, 'USD'));

export function useCurrentNativeSegwitBtcBalanceWithFallback() {
  const accountIndex = useCurrentAccountIndex();
  return useNativeSegwitBtcAccountBalanceWithFallback(accountIndex);
}

function useNativeSegwitBtcAccountBalanceWithFallback(accountIndex: number) {
  const balance = useNativeSegwitBtcAccountBalance(accountIndex);
  return balance.state === 'success'
    ? {
        isLoading: false,
        btc: balance.value.btc,
        quote: balance.value.quote,
      }
    : {
        isLoading: true,
        btc: fallbackBtcBalance,
        quote: fallbackQuoteBalance,
      };
}

export function useNativeSegwitBtcAccountBalance(accountIndex: number) {
  const account = useAccountAddresses(accountIndex);
  const discardedInscriptions = useDiscardedInscriptions();
  return toFetchState(
    useGetBtcAccountBalanceQuery({
      account,
      protections: {
        discardedInscriptions,
      },
      exclusions: { taprootAddresses: true },
    })
  );
}

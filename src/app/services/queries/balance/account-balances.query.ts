import type { Money } from '@leather.io/models';
import type {
  AccountQuotedBtcBalance,
  AddressQuotedStxBalance,
  RunesAccountBalance,
  Sip10AddressBalance,
} from '@leather.io/services';
import { createMoney, isDefined, sumMoney } from '@leather.io/utils';

import { type FetchState, toFetchState } from '@app/services/fetch-state';

import { useCurrentAccountBtcBalance } from './btc-balance.query';
import { useCurrentAccountRunesBalance } from './runes-balance.query';
import { useCurrentAccountSip10Balance } from './sip10-balance.query';
import { useCurrentAccountStxBalance } from './stx-balance.query';

// ts-unused-exports:disable-next-line
export interface AccountBalances {
  btc: FetchState<AccountQuotedBtcBalance>;
  stx: FetchState<AddressQuotedStxBalance>;
  sip10: FetchState<Sip10AddressBalance>;
  runes: FetchState<RunesAccountBalance>;
  totalBalance: FetchState<Money>;
  availableBalance: FetchState<Money>;
}

// ts-unused-exports:disable-next-line
export function useCurrentAccountBalances(): AccountBalances {
  const zeroMoneyUsd = createMoney(0, 'USD');

  const btcAccountBalance = useCurrentAccountBtcBalance();
  const stxAccountBalance = useCurrentAccountStxBalance();
  const runesAccountBalance = useCurrentAccountRunesBalance();
  const sip10AccountBalance = useCurrentAccountSip10Balance();

  const isLoading =
    btcAccountBalance.state === 'loading' &&
    stxAccountBalance.state === 'loading' &&
    sip10AccountBalance.state === 'loading' &&
    runesAccountBalance.state === 'loading';
  const isError =
    btcAccountBalance.state === 'error' &&
    stxAccountBalance.state === 'error' &&
    sip10AccountBalance.state === 'error' &&
    runesAccountBalance.state === 'error';
  const accountAvailableBalance = sumMoney(
    [
      zeroMoneyUsd,
      btcAccountBalance.value?.quote.availableBalance,
      stxAccountBalance.value?.quote.availableBalance,
      sip10AccountBalance.value?.quote.availableBalance,
      runesAccountBalance.value?.quote.availableBalance,
    ].filter(isDefined)
  );
  const accountTotalBalance = sumMoney(
    [
      zeroMoneyUsd,
      btcAccountBalance.value?.quote.totalBalance,
      stxAccountBalance.value?.quote.totalBalance,
      sip10AccountBalance.value?.quote.totalBalance,
      runesAccountBalance.value?.quote.totalBalance,
    ].filter(isDefined)
  );

  return {
    btc: btcAccountBalance,
    stx: stxAccountBalance,
    sip10: sip10AccountBalance,
    runes: runesAccountBalance,
    totalBalance: toFetchState({
      isLoading,
      data: accountTotalBalance,
      isError,
      error: new Error('Error loading account total balance data'),
    }),
    availableBalance: toFetchState({
      isLoading,
      data: accountAvailableBalance,
      isError,
      error: new Error('Error loading account available balance data'),
    }),
  };
}

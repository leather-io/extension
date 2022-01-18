import { atomFamilyWithInfiniteQuery, atomFamilyWithQuery } from 'jotai-query-toolkit';
import { QueryRefreshRates } from '@shared/constants';
import { apiClientAnchoredState, apiClientState } from '@app/store/common/api-clients';

import type {
  AccountBalanceResponseBigNumber,
  AddressBalanceResponse,
  AccountBalanceStxKeys,
} from '@shared/models/account-types';

import BigNumber from 'bignumber.js';
import { atomFamily } from 'jotai/utils';
import { atom } from 'jotai';
import { AccountStxBalanceBigNumber } from '@shared/models/account-types';
import deepEqual from 'fast-deep-equal';
import { PaginatedResults } from '@shared/models/types';
import { Transaction } from '@stacks/stacks-blockchain-api-types';
import { accountBalanceStxKeys } from './account.models';

enum AccountClientKeys {
  InfoClient = 'account/InfoClient',
  BalancesClient = 'account/BalancesClient',
  AnchoredBalancesClient = 'account/AnchoredBalancesClient',
  TransactionsClient = 'account/TransactionsClient',
  MempoolTransactionsClient = 'account/MempoolTransactionsClient',
}

type PrincipalWithNetworkUrl = { principal: string; networkUrl: string };
type PrincipalWithLimitNetworkUrl = { principal: string; limit: number; networkUrl: string };

export const accountBalancesUnanchoredClient = atomFamilyWithQuery<
  PrincipalWithNetworkUrl,
  AddressBalanceResponse
>(
  AccountClientKeys.BalancesClient,
  async function accountBalancesClientQueryFn(get, { principal }) {
    const { accountsApi } = get(apiClientState);
    return (await accountsApi.getAccountBalance({
      principal,
    })) as AddressBalanceResponse;
  },
  {
    keepPreviousData: false,
    refetchInterval: QueryRefreshRates.MEDIUM,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: 'always',
  }
);

const accountBalancesAnchoredClient = atomFamilyWithQuery<
  PrincipalWithNetworkUrl,
  AddressBalanceResponse
>(
  AccountClientKeys.AnchoredBalancesClient,
  async function accountBalancesClientQueryFn(get, { principal }) {
    const { accountsApi } = get(apiClientAnchoredState); // using the anchored client
    return (await accountsApi.getAccountBalance({
      principal,
    })) as AddressBalanceResponse;
  },
  {
    keepPreviousData: false,
    refetchInterval: QueryRefreshRates.MEDIUM,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: 'always',
  }
);

export const accountBalancesAnchoredBigNumber = atomFamily<
  PrincipalWithNetworkUrl,
  AccountBalanceResponseBigNumber
>(
  ({ principal, networkUrl }) =>
    atom(get => {
      const balances = get(accountBalancesAnchoredClient({ principal, networkUrl }));
      const stxBigNumbers = Object.fromEntries(
        accountBalanceStxKeys.map(key => [key, new BigNumber(balances.stx[key])])
      ) as Record<AccountBalanceStxKeys, BigNumber>;
      const stx: AccountStxBalanceBigNumber = {
        ...balances.stx,
        ...stxBigNumbers,
      };
      return {
        ...balances,
        stx,
      };
    }),
  deepEqual
);

export const accountTransactionsUnanchoredClient = atomFamilyWithInfiniteQuery<
  PrincipalWithLimitNetworkUrl,
  PaginatedResults<Transaction>
>(
  AccountClientKeys.TransactionsClient,
  async function accountTransactionsClientQueryFn(get, { principal, limit = 30 }) {
    const { accountsApi } = get(apiClientState);

    return (await accountsApi.getAccountTransactions({
      principal,
      limit,
    })) as PaginatedResults<Transaction>;
  },
  {
    refetchInterval: QueryRefreshRates.MEDIUM,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: 'always',
  }
);

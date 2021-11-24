import { atomFamilyWithInfiniteQuery } from 'jotai-query-toolkit';
import { atomFamilyWithQuery } from '@store/query';
import { QueryRefreshRates } from '@common/constants';
import { apiClientAnchoredState, apiClientState } from '@store/common/api-clients';
import type { Transaction, AccountDataResponse } from '@stacks/stacks-blockchain-api-types';
import type {
  AccountBalanceResponseBigNumber,
  AddressBalanceResponse,
  AccountBalanceStxKeys,
} from './types';

import BigNumber from 'bignumber.js';
import { atomFamily } from 'jotai/utils';
import { atom } from 'jotai';
import { AccountStxBalanceBigNumber } from './types';
import deepEqual from 'fast-deep-equal';
import { PaginatedResults } from '@common/types';
import { logger } from '@common/logger';

enum AccountClientKeys {
  InfoClient = 'account/InfoClient',
  BalancesClient = 'account/BalancesClient',
  AnchoredBalancesClient = 'account/AnchoredBalancesClient',
  TransactionsClient = 'account/TransactionsClient',
  MempoolTransactionsClient = 'account/MempoolTransactionsClient',
}

type PrincipalWithNetworkUrl = { principal: string; networkUrl: string };
type PrincipalWithLimitNetworkUrl = { principal: string; limit: number; networkUrl: string };

const accountBalanceStxKeys: AccountBalanceStxKeys[] = [
  'balance',
  'total_sent',
  'total_received',
  'total_fees_sent',
  'total_miner_rewards_received',
  'locked',
];

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

export const accountBalancesUnanchoredBigNumberState = atomFamily<
  PrincipalWithNetworkUrl,
  AccountBalanceResponseBigNumber
>(
  ({ principal, networkUrl }) =>
    atom(get => {
      const balances = get(accountBalancesUnanchoredClient({ principal, networkUrl }));
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

export const accountInfoUnanchoredClient = atomFamilyWithQuery<
  PrincipalWithNetworkUrl,
  AccountDataResponse
>(
  AccountClientKeys.InfoClient,
  async function accountInfoClientQueryFn(get, { principal }) {
    const { accountsApi } = get(apiClientState);
    return (await accountsApi.getAccountInfo({
      principal,
      proof: 0,
    })) as AccountDataResponse;
  },
  {
    refetchInterval: QueryRefreshRates.MEDIUM,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: 'always',
  }
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

import { atomFamilyWithInfiniteQuery } from 'jotai-query-toolkit';
import { atomFamilyWithQuery } from '@store/query';
import { QueryRefreshRates } from '@common/constants';
import { apiClientAnchoredState, apiClientState } from '@store/common/api-clients';
import type {
  MempoolTransaction,
  Transaction,
  AccountDataResponse,
} from '@stacks/stacks-blockchain-api-types';
import type {
  AccountBalanceResponseBigNumber,
  AddressBalanceResponse,
  AccountBalanceStxKeys,
} from './types';

import BigNumber from 'bignumber.js';
import { atomFamily } from 'jotai/utils';
import { atom } from 'jotai';
import { AccountStxBalanceBigNumber } from './types';

enum AccountClientKeys {
  InfoClient = 'account/InfoClient',
  BalancesClient = 'account/BalancesClient',
  AnchoredBalancesClient = 'account/AnchoredBalancesClient',
  TransactionsClient = 'account/TransactionsClient',
  MempoolTransactionsClient = 'account/MempoolTransactionsClient',
}

type PrincipalWithNetworkUrl = { principal: string; networkUrl: string };
type PrincipalWithLimitNetworkUrl = { principal: string; limit: number; networkUrl: string };

export interface PaginatedResults<T> {
  limit: number;
  offset: number;
  total: number;
  results: T[];
}

const accountBalanceStxKeys: AccountBalanceStxKeys[] = [
  'balance',
  'total_sent',
  'total_received',
  'total_fees_sent',
  'total_miner_rewards_received',
  'locked',
];

export const accountBalancesClient = atomFamilyWithQuery<
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
    refetchInterval: QueryRefreshRates.FAST,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: 'always',
  }
);

export const accountBalancesBigNumber = atomFamily<
  PrincipalWithNetworkUrl,
  AccountBalanceResponseBigNumber
>(params =>
  atom(get => {
    const balances = get(accountBalancesClient(params));

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
  })
);

export const accountBalancesAnchoredClient = atomFamilyWithQuery<
  PrincipalWithNetworkUrl,
  AddressBalanceResponse
>(
  AccountClientKeys.AnchoredBalancesClient,
  async function accountBalancesClientQueryFn(get, [principal, _networkUrl]) {
    const { accountsApi } = get(apiClientAnchoredState); // using the anchored client
    return (await accountsApi.getAccountBalance({
      principal,
    })) as AddressBalanceResponse;
  },
  {
    refetchInterval: QueryRefreshRates.FAST,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: 'always',
  }
);

export const accountInfoClient = atomFamilyWithQuery<PrincipalWithNetworkUrl, AccountDataResponse>(
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

export const accountTransactionsClient = atomFamilyWithInfiniteQuery<
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
    refetchInterval: QueryRefreshRates.FAST,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: 'always',
  }
);

export const accountMempoolTransactionsClient = atomFamilyWithInfiniteQuery<
  PrincipalWithLimitNetworkUrl,
  PaginatedResults<MempoolTransaction>
>(
  AccountClientKeys.MempoolTransactionsClient,
  async function accountMempoolTransactionsClientQueryFn(get, { principal, limit = 30 }) {
    const { transactionsApi } = get(apiClientState);
    return (await transactionsApi.getAddressMempoolTransactions({
      address: principal,
      limit,
    })) as PaginatedResults<MempoolTransaction>;
  },
  {
    refetchInterval: QueryRefreshRates.FAST,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: 'always',
  }
);

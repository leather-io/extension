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
import deepEqual from 'fast-deep-equal';

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

export const accountBalancesAnchoredClient = atomFamilyWithQuery<
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

const droppedCache = new Map();

export const accountMempoolTransactionsUnanchoredClient = atomFamilyWithInfiniteQuery<
  PrincipalWithLimitNetworkUrl,
  PaginatedResults<MempoolTransaction>
>(
  AccountClientKeys.MempoolTransactionsClient,
  async function accountMempoolTransactionsClientQueryFn(get, { principal, limit = 30 }) {
    const { transactionsApi } = get(apiClientState);
    const data = (await transactionsApi.getAddressMempoolTransactions({
      address: principal,
      limit,
    })) as PaginatedResults<MempoolTransaction>;
    // we're fetching each one directly because the response from the tx endpoint provides more data
    // currently the tx_status from the mempool endpoint can give stale data
    // where the status can be `pending`, but in reality is `dropped_replace_by_fee`
    // TODO: remove these extra fetches when the api has been fixed
    const promises = data.results
      // only want to fetch ones of status pending
      .filter(tx => tx.tx_status === 'pending' && !droppedCache.has(tx.tx_id))
      .map(
        async item =>
          (await transactionsApi.getTransactionById({ txId: item.tx_id })) as MempoolTransaction
      );
    const results: MempoolTransaction[] = await Promise.all(promises);
    return {
      ...data,
      // we don't want to display and dropped txs
      results: results.filter(tx => {
        if (droppedCache.has(tx.tx_id)) return false;
        if (tx.tx_status !== 'pending') {
          // because stale txs persist in the mempool endpoint
          // we should cache dropped txids to prevent unneeded fetches
          droppedCache.set(tx.tx_id, true);
          return false;
        }
        return true;
      }),
    } as PaginatedResults<MempoolTransaction>;
  },
  {
    refetchInterval: QueryRefreshRates.MEDIUM,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: 'always',
  }
);

import { atomFamilyWithInfiniteQuery } from 'jotai-query-toolkit';
import { atomFamilyWithQuery } from '@store/query';
import { QueryRefreshRates } from '@common/constants';
import { apiClientState } from '@store/common/api-clients';
import type {
  MempoolTransaction,
  Transaction,
  AccountDataResponse,
} from '@stacks/stacks-blockchain-api-types';
import type { AccountBalanceResponseBigNumber, AddressBalanceResponse, Keys } from './types';

import BigNumber from 'bignumber.js';

enum AccountClientKeys {
  InfoClient = 'account/InfoClient',
  BalancesClient = 'account/BalancesClient',
  TransactionsClient = 'account/TransactionsClient',
  MempoolTransactionsClient = 'account/MempoolTransactionsClient',
}

type PrincipalWithNetworkUrl = [principal: string, networkUrl: string];
type PrincipalWithLimitNetworkUrl = [principal: string, limit: number, networkUrl: string];

export interface ResultsWithLimitOffsetTotal<T> {
  limit: number;
  offset: number;
  total: number;
  results: T[];
}

const keys: Keys[] = [
  'balance',
  'total_sent',
  'total_received',
  'total_fees_sent',
  'total_miner_rewards_received',
  'locked',
];

export const accountBalancesClient = atomFamilyWithQuery<
  PrincipalWithNetworkUrl,
  AccountBalanceResponseBigNumber
>(
  AccountClientKeys.BalancesClient,
  async function accountBalancesClientQueryFn(get, [principal, _networkUrl]) {
    const { accountsApi } = get(apiClientState);
    const balances = (await accountsApi.getAccountBalance({
      principal,
    })) as AddressBalanceResponse;
    const stx: any = balances.stx;
    keys.forEach(key => {
      stx[key] = new BigNumber(balances.stx[key]);
    });
    return {
      ...balances,
      stx,
    };
  },
  {
    refetchInterval: QueryRefreshRates.MEDIUM,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: 'always',
  }
);

export const accountInfoClient = atomFamilyWithQuery<PrincipalWithNetworkUrl, AccountDataResponse>(
  AccountClientKeys.InfoClient,
  async function accountInfoClientQueryFn(get, [principal, _networkUrl]) {
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
  ResultsWithLimitOffsetTotal<Transaction>
>(
  AccountClientKeys.TransactionsClient,
  async function accountTransactionsClientQueryFn(get, [principal, limit = 30, _networkUrl]) {
    const { accountsApi } = get(apiClientState);
    return (await accountsApi.getAccountTransactions({
      principal,
      limit,
    })) as ResultsWithLimitOffsetTotal<Transaction>;
  }
);

export const accountMempoolTransactionsClient = atomFamilyWithInfiniteQuery<
  PrincipalWithLimitNetworkUrl,
  ResultsWithLimitOffsetTotal<MempoolTransaction>
>(
  AccountClientKeys.MempoolTransactionsClient,
  async function accountMempoolTransactionsClientQueryFn(
    get,
    [principal, limit = 30, _networkUrl]
  ) {
    const { transactionsApi } = get(apiClientState);
    return (await transactionsApi.getAddressMempoolTransactions({
      address: principal,
      limit,
    })) as ResultsWithLimitOffsetTotal<MempoolTransaction>;
  }
);

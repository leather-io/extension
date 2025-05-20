import { useQuery } from '@tanstack/react-query';

import {
  createGetSip10AddressBalancesQueryOptions,
  createGetStxAddressBalanceQueryOptions,
} from '@leather.io/query';
import { createMoney } from '@leather.io/utils';

import { useCurrentNetworkState } from '@app/query/leather-query-provider';

import {
  useMempoolTxsInboundBalance,
  useMempoolTxsOutboundBalance,
} from '../mempool/mempool.hooks';
import { useStacksClient } from '../stacks-client';
import { createStxCryptoAssetBalance, createStxMoney } from './account-balance.utils';

function useStxBalanceQuery(address: string) {
  const client = useStacksClient();
  const network = useCurrentNetworkState();

  return useQuery({
    ...createGetStxAddressBalanceQueryOptions({
      address,
      client,
      network: network.chain.stacks.url,
    }),
    select: resp => createStxMoney(resp),
  });
}

export function useStxCryptoAssetBalance(address: string) {
  const client = useStacksClient();
  const network = useCurrentNetworkState();

  const initialBalanceQuery = useStxBalanceQuery(address);

  const defaultPendingBalance = createMoney(0, 'STX');
  const { balance: inboundBalance = defaultPendingBalance, query } =
    useMempoolTxsInboundBalance(address);
  const { balance: outboundBalance = defaultPendingBalance } =
    useMempoolTxsOutboundBalance(address);

  const filteredBalanceQuery = useQuery({
    ...createGetStxAddressBalanceQueryOptions({
      address,
      client,
      network: network.chain.stacks.url,
    }),
    select: resp => {
      const initialBalance = createStxMoney(resp);
      return createStxCryptoAssetBalance(initialBalance, inboundBalance, outboundBalance);
    },
    enabled: !!initialBalanceQuery.data,
  });

  return {
    initialBalanceQuery,
    filteredBalanceQuery,
    isLoadingAdditionalData: query.isLoading,
  };
}

export function useStxAvailableUnlockedBalance(address: string) {
  const stxBalance = useStxCryptoAssetBalance(address);
  return stxBalance.filteredBalanceQuery.data?.availableUnlockedBalance ?? createMoney(0, 'STX');
}

export function useStacksAccountBalanceFungibleTokens(address: string) {
  const client = useStacksClient();
  const network = useCurrentNetworkState();

  return useQuery({
    ...createGetSip10AddressBalancesQueryOptions({
      address,
      client,
      network: network.chain.stacks.url,
    }),
  });
}

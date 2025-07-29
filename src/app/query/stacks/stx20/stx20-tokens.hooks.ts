import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';

import { createGetStx20BalancesQueryOptions, createStx20Asset } from '@leather.io/query';
import { createBaseCryptoAssetBalance, createMoney } from '@leather.io/utils';

import { useCurrentNetworkState } from '@app/query/leather-query-provider';

import { useStacksClient } from '../stacks-client';

export function useStx20Tokens(address: string) {
  const client = useStacksClient();
  const network = useCurrentNetworkState();

  return useQuery({
    ...createGetStx20BalancesQueryOptions({
      address,
      chainId: network.chain.stacks.chainId,
      client,
    }),
    select: resp =>
      resp.map(stx20Balance => ({
        balance: createBaseCryptoAssetBalance(
          createMoney(new BigNumber(stx20Balance.balance), stx20Balance.ticker, 0)
        ),
        info: createStx20Asset(stx20Balance),
      })),
  });
}

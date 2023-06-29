import { TokenTransferTransaction } from '@stacks/stacks-blockchain-api-types';
import { useQuery } from '@tanstack/react-query';

import { createMoney } from '@shared/models/money.model';

import { sumNumbers } from '@app/common/math/helpers';
import { useStacksClientUnanchored } from '@app/store/common/api-clients.hooks';

export function useCurrentAccountMicroblockBalanceQuery(address: string) {
  const client = useStacksClientUnanchored();

  async function accountMicroblockFetcher() {
    const txs = await client.microblocksApi.getUnanchoredTxs({});
    return txs.results as TokenTransferTransaction[];
  }
  return useQuery({
    enabled: !!address,
    queryKey: ['account-microblock', address],
    queryFn: accountMicroblockFetcher,
    select: resp => {
      const senderMicroblockTxs = resp.filter(tx => tx.sender_address === address);
      return createMoney(
        sumNumbers(senderMicroblockTxs.map(tx => Number(tx.token_transfer.amount))),
        'STX'
      );
    },
    refetchOnWindowFocus: false,
  });
}

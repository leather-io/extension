import { useStacksPendingTransactions } from '@app/query/stacks/mempool/mempool.hooks';
import { useGetAccountNoncesQuery } from '@app/query/stacks/nonce/account-nonces.query';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { useStacksConfirmedTransactions } from '../transactions/transactions-with-transfers.hooks';
import { parseAccountNoncesResponse } from './account-nonces.utils';

export function useNextNonce() {
  const currentAccount = useCurrentStacksAccount();
  const confirmedTransactions = useStacksConfirmedTransactions();
  const { transactions: pendingTransactions } = useStacksPendingTransactions();

  return useGetAccountNoncesQuery({
    select: resp =>
      parseAccountNoncesResponse({
        addressNonces: resp,
        confirmedTransactions,
        pendingTransactions,
        senderAddress: currentAccount?.address ?? '',
      }),
  });
}

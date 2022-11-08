import { useStacksPendingTransactions } from '@app/query/stacks/mempool/mempool.hooks';
import { useGetAccountNonces } from '@app/query/stacks/nonce/account-nonces.query';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';

import { useStacksConfirmedTransactions } from '../transactions/transactions-with-transfers.hooks';
import { NonceTypes, getNextNonce } from './account-nonces.utils';

export function useNextNonce() {
  const currentAccount = useCurrentAccount();
  const confirmedTransactions = useStacksConfirmedTransactions();
  const { transactions: pendingTransactions } = useStacksPendingTransactions();

  const { data: addressNonces } = useGetAccountNonces();

  const nextNonce = addressNonces
    ? getNextNonce({
        addressNonces,
        confirmedTransactions,
        pendingTransactions,
        senderAddress: currentAccount?.address ?? '',
      })
    : { nonce: undefined, nonceType: NonceTypes.undefinedNonce };

  return nextNonce;
}

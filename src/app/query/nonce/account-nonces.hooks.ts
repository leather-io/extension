import { useGetAccountNonces } from '@app/query/nonce/account-nonces.query';
import { useCurrentAccountFilteredMempoolTransactionsState } from '@app/query/mempool/mempool.hooks';
import { useAccountConfirmedTransactions } from '@app/store/accounts/account.hooks';

import { getNextNonce, NonceTypes } from './account-nonces.utils';

export function useNextNonce() {
  const confirmedTransactions = useAccountConfirmedTransactions();
  const pendingTransactions = useCurrentAccountFilteredMempoolTransactionsState();

  const { data: addressNonces } = useGetAccountNonces();

  const nextNonce = addressNonces
    ? getNextNonce(addressNonces, confirmedTransactions, pendingTransactions)
    : { nonce: undefined, nonceType: NonceTypes.undefinedNonce };

  return nextNonce;
}

import { useGetAccountNonces } from '@app/query/stacks/nonce/account-nonces.query';
import { useCurrentAccountFilteredMempoolTransactionsState } from '@app/query/stacks/mempool/mempool.hooks';
import {
  useAccountConfirmedTransactions,
  useCurrentAccount,
} from '@app/store/accounts/account.hooks';

import { getNextNonce, NonceTypes } from './account-nonces.utils';

export function useNextNonce() {
  const currentAccount = useCurrentAccount();
  const confirmedTransactions = useAccountConfirmedTransactions();
  const pendingTransactions = useCurrentAccountFilteredMempoolTransactionsState();

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

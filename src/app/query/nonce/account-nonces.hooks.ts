import { UseQueryOptions } from 'react-query';
import toast from 'react-hot-toast';
import { AddressNonces } from '@stacks/blockchain-api-client/lib/generated';

import { useGetAccountNonces } from '@app/query/nonce/account-nonces.query';
import { useCurrentAccountFilteredMempoolTransactionsState } from '@app/query/mempool/mempool.hooks';
import { useCurrentAccountNonceState } from '@app/store/nonce/nonce.hooks';
import { useAccountConfirmedTransactions } from '@app/store/accounts/account.hooks';

import { getNextNonce } from './account-nonces.utils';

const accountNoncesQueryOptions = {
  refetchOnMount: 'always',
  refetchOnReconnect: 'always',
  refetchOnWindowFocus: 'always',
};

export function useNextNonce() {
  const [currentAccountNonce, setCurrentAccountNonce] = useCurrentAccountNonceState();
  const confirmedTransactions = useAccountConfirmedTransactions();
  const pendingTransactions = useCurrentAccountFilteredMempoolTransactionsState();

  const queryOptions = {
    onError: () => {
      toast.error('No nonce found');
      setCurrentAccountNonce(undefined);
    },
    onSuccess: (data: AddressNonces) => {
      const nextNonce = data && getNextNonce(data, confirmedTransactions, pendingTransactions);
      if (nextNonce) setCurrentAccountNonce(nextNonce);
    },
    ...accountNoncesQueryOptions,
  };
  useGetAccountNonces(queryOptions as UseQueryOptions);
  return currentAccountNonce ?? 0;
}

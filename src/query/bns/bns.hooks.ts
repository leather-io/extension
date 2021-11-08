import { logger } from '@common/logger';
import { useAccounts, useCurrentAccountStxAddressState } from '@store/accounts/account.hooks';
import { useGetBnsNamesOwnedByAddress, useGetBnsNamesOwnedByAddressList } from './bns.query';

export function useAllAccountNames() {
  const accounts = useAccounts() ?? [];
  const result = useGetBnsNamesOwnedByAddressList(accounts.map(a => a.address));
  return accounts.map(({ address, index }) => ({
    address,
    index,
    names: result[index].data?.names ?? [],
  }));
}

export function useCurrentAccountNames() {
  const principal = useCurrentAccountStxAddressState();
  if (!principal) logger.error('No principal defined');
  const namesResponse = useGetBnsNamesOwnedByAddress(principal ?? '');
  return namesResponse.data?.names ?? [];
}

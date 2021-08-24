import { atom } from 'jotai';
import { accountsWithAddressState, currentAccountStxAddressState } from './index';
import { currentNetworkState } from '@store/network/networks';
import { atomFamilyWithQuery } from '@store/query';
import { apiClientState } from '@store/common/api-clients';
import { atomFamily } from 'jotai/utils';

interface AccountName {
  address: string;
  index: number;
  names: string[];
}

type AccountNameState = AccountName[] | null;

const STALE_TIME = 15 * 60 * 1000; // 15 min

const namesResponseState = atomFamilyWithQuery<[string, string], string[]>(
  'ACCOUNT_NAMES',
  async (get, [address, _networkUrl]) => {
    const { bnsApi } = get(apiClientState);
    const results = await bnsApi.getNamesOwnedByAddress({
      address,
      blockchain: 'stacks',
    });
    return results.names || [];
  },
  {
    keepPreviousData: true,
    // for persistence, see common/persistence.ts
    cacheTime: STALE_TIME,
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnReconnect: false,
  }
);

const accountNameState = atomFamily<string, string[]>(principal =>
  atom(get => {
    const network = get(currentNetworkState);
    return get(namesResponseState([principal, network.url]));
  })
);

export const allAccountsNameState = atom<AccountNameState>(get => {
  const accounts = get(accountsWithAddressState);
  const network = get(currentNetworkState);
  if (!network || !accounts) return [];
  return accounts.map(({ address, index }) => ({
    address,
    index,
    names: get(accountNameState(address)),
  }));
});

export const currentAccountNameState = atom(get => {
  const principal = get(currentAccountStxAddressState);
  if (!principal) return [];
  return get(accountNameState(principal));
});

allAccountsNameState.debugLabel = 'accountNameState';

import { selector, atom, atomFamily } from 'recoil';
import { currentIdentityStore, latestNonceStore } from './wallet';
import { rpcClientStore, currentNetworkStore } from './networks';
import type { CoreNodeInfoResponse } from '@blockstack/stacks-blockchain-api-types';

export const apiRevalidation = atom({
  key: 'api.revalidation',
  default: 0,
});

export const intervalStore = atomFamily<number, number>({
  key: 'api.intervals',
  default: 0,
  effects_UNSTABLE: (intervalMilliseconds: number) => [
    ({ setSelf }) => {
      const interval = setInterval(() => {
        setSelf(current => {
          if (typeof current === 'number') {
            return current + 1;
          }
          return 1;
        });
      }, intervalMilliseconds);

      return () => {
        clearInterval(interval);
      };
    },
  ],
});

export const accountInfoStore = selector({
  key: 'wallet.account-info',
  get: async ({ get }) => {
    get(apiRevalidation);
    get(intervalStore(15000));
    const currentIdentity = get(currentIdentityStore);
    const rpcClient = get(rpcClientStore);
    if (!currentIdentity) {
      throw new Error('Cannot get account info when logged out.');
    }
    const info = await rpcClient.fetchAccount(currentIdentity?.getStxAddress());
    return info;
  },
});

export const chainInfoStore = selector({
  key: 'api.chain-info',
  get: async ({ get }) => {
    get(apiRevalidation);
    get(intervalStore(15000));
    const { url } = get(currentNetworkStore);
    const res = await fetch(`${url}/v2/info`);
    const info: CoreNodeInfoResponse = await res.json();
    return info;
  },
});

export const correctNonceStore = selector({
  key: 'api.correct-nonce',
  get: ({ get }) => {
    const chainInfo = get(chainInfoStore);
    const account = get(accountInfoStore);
    const lastTx = get(latestNonceStore);

    // Blocks have been mined since the last TX from this user.
    // This is the most likely scenario.
    if (account.nonce > lastTx.nonce) {
      return account.nonce;
    }
    // The current stacks chain has been reset since the user's last TX.
    // In this case, use the remote nonce.
    if (chainInfo.stacks_tip_height < lastTx.blockHeight) {
      return account.nonce;
    }
    // No blocks have been mined since the latest transaction from this user.
    return lastTx.nonce + 1;
  },
});

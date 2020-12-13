import { atom, selector } from 'recoil';
import { localStorageEffect } from './index';
import { Wallet } from '@stacks/keychain';

export const secretKeyStore = atom<string | undefined>({
  key: 'wallet.secret-key',
  default: undefined,
  effects_UNSTABLE: [localStorageEffect()],
});

export const hasSetPasswordStore = atom<boolean>({
  key: 'wallet.has-set-password',
  default: false,
  effects_UNSTABLE: [localStorageEffect()],
});

export const walletStore = atom<Wallet | undefined>({
  key: 'wallet.wallet',
  default: undefined,
  effects_UNSTABLE: [
    localStorageEffect({
      serialize: wallet => {
        if (!wallet) return '';
        return JSON.stringify(wallet);
      },
      deserialize: walletJSON => {
        if (!walletJSON) return undefined;
        return new Wallet(JSON.parse(walletJSON));
      },
    }),
  ],
});

export const currentIdentityIndexStore = atom<number | undefined>({
  key: 'wallet.current-identity-index',
  default: undefined,
  effects_UNSTABLE: [localStorageEffect()],
});

export const encryptedSecretKeyStore = atom<string | undefined>({
  key: 'wallet.encrypted-key',
  default: undefined,
  effects_UNSTABLE: [localStorageEffect()],
});

export const currentIdentityStore = selector({
  key: 'wallet.current-identity',
  get: ({ get }) => {
    const identityIndex = get(currentIdentityIndexStore);
    const wallet = get(walletStore);
    if (identityIndex === undefined || !wallet) {
      return undefined;
    }
    return wallet.identities[identityIndex];
  },
});

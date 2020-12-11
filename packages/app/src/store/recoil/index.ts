import { atom, AtomEffect } from 'recoil';

export const localStorageEffect = <T>(): AtomEffect<T> => ({ setSelf, onSet, node }) => {
  const { key } = node;
  if (typeof window !== 'undefined') {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet(newValue => {
      localStorage.setItem(key, JSON.stringify(newValue));
    });
  }
};

export enum AccountStep {
  Switch = 'switch',
  Create = 'create',
  Username = 'username',
}

export const accountDrawerStep = atom<AccountStep>({
  key: 'drawers.accounts.visibility',
  default: AccountStep.Switch,
});

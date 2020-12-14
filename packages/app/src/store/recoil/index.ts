import { atom, AtomEffect, DefaultValue } from 'recoil';

interface LocalStorageTransformer<T> {
  serialize: (atom: T | DefaultValue) => string;
  deserialize: (serialized: string) => T;
}

export const localStorageEffect = <T>(transformer?: LocalStorageTransformer<T>): AtomEffect<T> => ({
  setSelf,
  onSet,
  node,
}) => {
  const { key } = node;
  if (typeof window !== 'undefined') {
    const savedValue = localStorage.getItem(key);
    if (savedValue) {
      try {
        if (transformer) {
          setSelf(transformer.deserialize(savedValue));
        } else {
          setSelf(JSON.parse(savedValue));
        }
      } catch (error) {
        console.log(key, savedValue);
        console.log(error);
      }
    }

    onSet(newValue => {
      if (transformer) {
        const serialized = transformer.serialize(newValue);
        localStorage.setItem(key, serialized);
      } else {
        if (newValue !== null && newValue !== undefined) {
          localStorage.setItem(key, JSON.stringify(newValue));
        } else {
          localStorage.removeItem(key);
        }
      }
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

import { atom, AtomEffect, DefaultValue } from 'recoil';

export const ATOM_LOCALSTORAGE_PREFIX = '__hiro-recoil__';

export const localStorageKey = (atomKey: string): string => {
  return `${ATOM_LOCALSTORAGE_PREFIX}${atomKey}`;
};

interface LocalStorageTransformer<T> {
  serialize: (atom: T | DefaultValue) => string;
  deserialize: (serialized: string) => T;
}

interface LocalStorageEffectOptions<T> {
  transformer?: LocalStorageTransformer<T>;
  onlyExtension?: boolean;
}
export const localStorageEffect = <T>({
  transformer,
  onlyExtension,
}: LocalStorageEffectOptions<T> = {}): AtomEffect<T> => ({ setSelf, onSet, node }) => {
  if (onlyExtension && EXT_ENV === 'web') return;

  const key = localStorageKey(node.key);
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
        if (serialized) {
          localStorage.setItem(key, serialized);
        } else {
          localStorage.remoteItem(key);
        }
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

import { atom } from 'jotai';

export const selectedAssetIdState = atom<string | undefined>(undefined);

export const searchInputStore = atom<string>('');

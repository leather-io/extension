import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

type LoadingState = 'idle' | 'loading';

export const loadingState = atomFamily(_param => {
  const anAtom = atom<LoadingState>('idle');
  anAtom.debugLabel = `loading-atom/${_param}`;
  return anAtom;
});

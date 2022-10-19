import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { userHasAllowedDiagnosticsKey } from '@shared/utils/storage';

export const seedInputErrorState = atom<string | undefined>(undefined);
export const secretKeyState = atom(null);

export const hasAllowedDiagnosticsState = atomWithStorage<boolean | undefined>(
  userHasAllowedDiagnosticsKey,
  undefined
);

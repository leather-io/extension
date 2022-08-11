import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { DecodedAuthRequest } from '@shared/models/decoded-auth-request';
import { userHasAllowedDiagnosticsKey } from '@shared/utils/storage';

interface AuthRequestState {
  authRequest?: string;
  decodedAuthRequest?: DecodedAuthRequest;
  appName?: string;
  appIcon?: string;
  appURL?: URL;
}

export const seedInputErrorState = atom<string | undefined>(undefined);
export const secretKeyState = atom(null);
export const authRequestState = atom<AuthRequestState>({
  authRequest: undefined,
  decodedAuthRequest: undefined,
  appName: undefined,
  appIcon: undefined,
  appURL: undefined,
});

export const hasAllowedDiagnosticsState = atomWithStorage<boolean | undefined>(
  userHasAllowedDiagnosticsKey,
  undefined
);

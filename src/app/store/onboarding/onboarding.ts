import { atom } from 'jotai';
import { atomWithDefault, atomWithStorage } from 'jotai/utils';

import { DecodedAuthRequest } from '@app/common/dev/types';
import { userHasAllowedDiagnosticsKey } from '@shared/utils/storage';

interface AuthRequestState {
  authRequest?: string;
  decodedAuthRequest?: DecodedAuthRequest;
  appName?: string;
  appIcon?: string;
  appURL?: URL;
}

export const magicRecoveryCodePasswordState = atom('');
export const seedInputState = atom('');
export const seedInputErrorState = atom<string | undefined>(undefined);
export const secretKeyState = atomWithDefault(() => null);
export const magicRecoveryCodeState = atomWithDefault<null | string>(() => null);
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

magicRecoveryCodePasswordState.debugLabel = 'magicRecoveryCodePasswordState';
seedInputState.debugLabel = 'seedInputState';
seedInputErrorState.debugLabel = 'seedInputErrorState';
secretKeyState.debugLabel = 'secretKeyState';
magicRecoveryCodeState.debugLabel = 'magicRecoveryCodeState';
authRequestState.debugLabel = 'authRequestState';

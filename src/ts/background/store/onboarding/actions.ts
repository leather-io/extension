import {
  OnboardingActions,
  CHANGE_PAGE,
  Screen,
  DEFAULT_PASSWORD,
  SAVE_KEY,
  SAVE_AUTH_REQUEST,
} from './types';
import { decodeToken } from 'jsontokens';
import { doGenerateWallet } from '@store/wallet';
import { ThunkAction } from 'redux-thunk';
import { decrypt } from '@blockstack/keychain';
import { DecodedAuthRequest, AppManifest } from '@dev/types';

export const doChangeScreen = (screen: Screen): OnboardingActions => ({
  type: CHANGE_PAGE,
  screen,
});

export const doSaveSecretKey = (secretKey: string): OnboardingActions => ({
  type: SAVE_KEY,
  secretKey,
});

export function doCreateSecretKey(): ThunkAction<
  void,
  {},
  {},
  OnboardingActions
> {
  return async dispatch => {
    const wallet = await dispatch(doGenerateWallet(DEFAULT_PASSWORD));
    const secretKey = await decrypt(
      wallet.encryptedBackupPhrase,
      DEFAULT_PASSWORD
    );
    dispatch(doSaveSecretKey(secretKey));
  };
}

const loadManifest = async (decodedAuthRequest: DecodedAuthRequest) => {
  const res = await fetch(decodedAuthRequest.manifest_uri);
  const json: AppManifest = await res.json();
  return json;
};

interface SaveAuthRequestParams {
  appManifest: AppManifest;
  decodedAuthRequest: DecodedAuthRequest;
  authRequest: string;
}

const saveAuthRequest = ({
  appManifest,
  decodedAuthRequest,
  authRequest,
}: SaveAuthRequestParams): OnboardingActions => {
  return {
    type: SAVE_AUTH_REQUEST,
    appManifest,
    decodedAuthRequest,
    authRequest,
  };
};

export function doSaveAuthRequest(
  authRequest: string
): ThunkAction<void, {}, {}, OnboardingActions> {
  return async dispatch => {
    const { payload } = decodeToken(authRequest);
    const decodedAuthRequest = (payload as unknown) as DecodedAuthRequest;
    const appManifest = await loadManifest(decodedAuthRequest);
    dispatch(
      saveAuthRequest({
        appManifest,
        decodedAuthRequest,
        authRequest,
      })
    );
  };
}

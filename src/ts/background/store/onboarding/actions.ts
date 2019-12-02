import {
  OnboardingActions,
  CHANGE_PAGE,
  Screen,
  DEFAULT_PASSWORD,
  SAVE_KEY,
} from './types';
import { doGenerateWallet } from '@store/wallet';
import { ThunkAction } from 'redux-thunk';
import { decrypt } from '@blockstack/keychain';

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

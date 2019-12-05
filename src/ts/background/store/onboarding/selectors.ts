import { IAppState } from '@store';

export const selectCurrentScreen = (state: IAppState) => {
  return state.onboarding.screen;
};

export const selectSecretKey = (state: IAppState) => {
  return state.onboarding.secretKey;
};

export const selectDecodedAuthRequest = (state: IAppState) => {
  return state.onboarding.decodedAuthRequest;
};

export const selectAppManifest = (state: IAppState) => {
  return state.onboarding.appManifest;
};

export const selectAuthRequest = (state: IAppState) => {
  return state.onboarding.authRequest;
};

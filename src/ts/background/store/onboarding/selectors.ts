import { IAppState } from '@store';

export const selectCurrentScreen = (state: IAppState) => {
  return state.onboarding.screen;
};

export const selectSecretKey = (state: IAppState) => {
  return state.onboarding.secretKey;
};

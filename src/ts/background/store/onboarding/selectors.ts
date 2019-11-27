import { IAppState } from '@store';

export const selectCurrentScreen = (state: IAppState) => {
  return state.onboarding.screen;
};

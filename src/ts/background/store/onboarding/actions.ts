import { OnboardingActions, CHANGE_PAGE } from './types';

export const doChangeScreen = (screen: string): OnboardingActions => ({
  type: CHANGE_PAGE,
  screen,
});

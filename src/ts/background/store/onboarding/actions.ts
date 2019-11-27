import { OnboardingActions, CHANGE_PAGE, Screen } from './types';

export const doChangeScreen = (screen: Screen): OnboardingActions => ({
  type: CHANGE_PAGE,
  screen,
});

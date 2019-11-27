export const CHANGE_PAGE = 'ONBOARDING/CHANGE_PAGE';

export enum Screen {
  INTRO = 'screens/INTRO',
  HOW_IT_WORKS = 'screens/HOW_IT_WORKS',
  CREATE = 'screens/CREATE',
  SECRET_KEY = 'screens/SECRET_KEY',
  SAVE_KEY = 'screens/SAVE_KEY',
  CONNECT_APP = 'screens/CONNECT_APP',
  CONNECTED = 'screens/CONNECTED',
  SIGN_IN = 'screens/SIGN_IN',
}

export interface OnboardingState {
  screen: Screen;
}

interface ChangePageAction {
  type: typeof CHANGE_PAGE;
  screen: Screen;
}

export type OnboardingActions = ChangePageAction;

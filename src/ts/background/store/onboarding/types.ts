export const CHANGE_PAGE = 'ONBOARDING/CHANGE_PAGE';
export const SAVE_KEY = 'ONBOARDING/SAVE_KEY';

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

// TODO: clarify usage of password for local key encryption
export const DEFAULT_PASSWORD = 'password';

export interface OnboardingState {
  screen: Screen;
  secretKey?: string;
}

interface ChangePageAction {
  type: typeof CHANGE_PAGE;
  screen: Screen;
}

interface StoreSecretKey {
  type: typeof SAVE_KEY;
  secretKey: string;
}

export type OnboardingActions = ChangePageAction | StoreSecretKey;

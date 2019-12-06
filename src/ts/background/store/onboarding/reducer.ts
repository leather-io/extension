import { Reducer } from 'redux';
import {
  OnboardingActions,
  OnboardingState,
  CHANGE_PAGE,
  Screen,
  SAVE_KEY,
  SAVE_AUTH_REQUEST,
} from './types';

const initialState: OnboardingState = {
  screen: Screen.INTRO,
};

export const onboardingReducer: Reducer<OnboardingState, OnboardingActions> = (
  state = initialState,
  action: OnboardingActions
) => {
  switch (action.type) {
    case CHANGE_PAGE:
      return {
        ...state,
        screen: action.screen,
      };
    case SAVE_KEY:
      return {
        ...state,
        secretKey: action.secretKey,
      };
    case SAVE_AUTH_REQUEST:
      const newState = {
        ...state,
        authRequest: action.authRequest,
        decodedAuthRequest: action.decodedAuthRequest,
        appManifest: action.appManifest,
      };
      if (action.decodedAuthRequest.sendToSignIn) {
        newState.screen = Screen.SIGN_IN;
      }
      return newState;
    default:
      return state;
  }
};

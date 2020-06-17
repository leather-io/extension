import { createContext } from 'react';
import { UserData } from 'blockstack/lib/auth/authApp';

export interface AppState {
  userData: UserData | null;
}

export const defaultState: AppState = {
  userData: null,
};

export const AppContext = createContext<AppState>(defaultState);

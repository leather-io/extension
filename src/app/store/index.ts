import { useDispatch, useSelector } from 'react-redux';
import { atomWithStore } from 'jotai/redux';
import devToolsEnhancer from 'remote-redux-devtools';

import { AnyAction, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import { keySlice } from './keys/key.slice';
import { stxChainSlice } from './chains/stx-chain.slice';
import { broadcastActionTypeToOtherFramesMiddleware } from './utils/broadcast-action-types';
import { inMemoryKeySlice } from './in-memory-key/in-memory-key.slice';
import { ExtensionStorage } from './utils/extension-storage';
import { onboardingSlice } from './onboarding/onboarding.slice';
import { analyticsSlice } from './analytics/analytics.slice';
import { appsSlice } from './apps/apps.slice';

const storage = new ExtensionStorage(chrome.storage.local, chrome.runtime);

const rootReducer = combineReducers({
  apps: appsSlice.reducer,
  keys: keySlice.reducer,
  chains: combineReducers({
    stx: stxChainSlice.reducer,
  }),
  inMemoryKeys: inMemoryKeySlice.reducer,
  onboarding: onboardingSlice.reducer,
  analytics: analyticsSlice.reducer,
});

// const logger = store => next => action => {
//   console.group(action.type);
//   console.info('dispatching', action);
//   let result = next(action);
//   console.log('next state', store.getState());
//   console.groupEnd();
//   return result;
// };

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  serialize: true,
  whitelist: ['apps', 'keys', 'chains', 'onboarding', 'analytics'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => [
    // logger,
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
    broadcastActionTypeToOtherFramesMiddleware,
  ],
  enhancers:
    process.env.WALLET_ENVIRONMENT === 'development'
      ? [
          devToolsEnhancer({
            hostname: 'localhost',
            port: 8000,
            realtime: true,
          }),
        ]
      : [],
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof persistedReducer>;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const storeAtom = atomWithStore(store);

const selectHasRehydrated = (state: RootState) => state._persist.rehydrated;

export function useHasStateRehydrated() {
  return useSelector(selectHasRehydrated);
}

import { useDispatch, useSelector } from 'react-redux';
import { atomWithStore } from 'jotai/redux';
import storage from 'redux-persist/lib/storage';
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

// const storage = new ChromeStorage(chrome.storage.local, chrome.runtime);

const rootReducer = combineReducers({
  keys: keySlice.reducer,
  chains: combineReducers({
    stx: stxChainSlice.reducer,
  }),
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  serialize: true,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => [
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
    broadcastActionTypeToOtherFramesMiddleware,
  ],
  enhancers: [
    devToolsEnhancer({
      hostname: 'localhost',
      port: 8000,
      realtime: true,
    }),
  ],
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

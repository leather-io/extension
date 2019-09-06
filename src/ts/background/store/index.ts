import { combineReducers, createStore, Store } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import counter, { ICounter } from './counter/reducer'
import settings, { IAppSettings } from './settings/reducer'
import { walletReducer, WalletState } from './wallet'

import 'redux'
// Enhance the Action interface with the option of a payload.
// While still importing the Action interface from redux.
declare module 'redux' {
  export interface Action<T = any, P = any> {
    type: T
    payload?: P
  }
}

export interface IAppState {
  counter: ICounter
  settings: IAppSettings
  wallet: WalletState
}

const reducers = combineReducers<IAppState>({
  counter,
  settings,
  wallet: walletReducer
})

const persistConfig = {
  storage,
  key: 'blockstack-redux'
}

const persistedReducer = persistReducer(persistConfig, reducers)

const _window = window as any

export const store: Store<IAppState> = createStore(
  persistedReducer,
  undefined,
  _window.__REDUX_DEVTOOLS_EXTENSION__ && _window.__REDUX_DEVTOOLS_EXTENSION__()
)

export const persistor = persistStore(store)

export default reducers

import { Store, wrapStore } from 'webext-redux'
import { createStore } from 'redux'
import { configureApp } from './AppConfig'
import reducers, { IAppState, loadState } from './store'

const preloadedState = loadState()

const _window = window as any

const store: Store<IAppState> = createStore(
  reducers,
  preloadedState,
  _window.__REDUX_DEVTOOLS_EXTENSION__ && _window.__REDUX_DEVTOOLS_EXTENSION__()
)

configureApp(store as any)

wrapStore(store, {
  portName: 'ExPort' // Communication port between the background component and views such as browser tabs.
})

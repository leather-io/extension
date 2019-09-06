import { wrapStore } from 'webext-redux'
import { store } from './store'

wrapStore(store, {
  portName: 'ExPort' // Communication port between the background component and views such as browser tabs.
})

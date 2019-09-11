import { wrapStore } from 'webext-redux'
import { store } from './store'

wrapStore(store, {
  portName: 'ExPort' // Communication port between the background component and views such as browser tabs.
})

chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'Blockstack-ContentScript') {
    port.onMessage.addListener(event => {
      if (event.method === 'auth') {
        console.log('Got an auth request', event)
      }
    })
  }
})

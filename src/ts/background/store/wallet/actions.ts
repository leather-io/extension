import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import Wallet from 'blockstack-keychain/lib-esm/wallet'
import { WalletActions, STORE_SEED } from './types'

export function didStoreSeed(seed: string): WalletActions {
  return {
    type: STORE_SEED,
    payload: seed
  }
}

// export function doStoreSeed(seed: string): ThunkAction<Promise<Wallet>, {}, {}, WalletActions> {
export function doStoreSeed(seed: string): ThunkAction<Promise<void>, {}, {}, WalletActions> {
  return async (dispatch: ThunkDispatch<{}, {}, WalletActions>) => {
    const url = chrome.runtime.getURL ? chrome.runtime.getURL('worker.js') : './worker.js'
    const worker = new Worker(url)
    worker.postMessage({ seed, password: 'password' })
    worker.addEventListener('message', event => {
      console.log('got something back', event)
    })
    dispatch(didStoreSeed(seed))
  }
}

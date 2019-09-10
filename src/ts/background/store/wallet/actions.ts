import { ThunkAction, ThunkDispatch } from 'redux-thunk'
// import Wallet from 'blockstack-keychain/lib-esm/wallet'
import { WalletActions, RESTORE_WALLET, IS_RESTORING_WALLET } from './types'

export function didStoreSeed(seed: string): WalletActions {
  return {
    type: RESTORE_WALLET,
    payload: seed
  }
}

function isRestoringWallet(): WalletActions {
  return {
    type: IS_RESTORING_WALLET
  }
}

export function doStoreSeed(seed: string): ThunkAction<void, {}, {}, WalletActions> {
  return (dispatch: ThunkDispatch<{}, {}, WalletActions>) => {
    dispatch(isRestoringWallet())
    const url = chrome.runtime.getURL ? chrome.runtime.getURL('worker.js') : './worker.js'
    const worker = new Worker(url)
    worker.postMessage({ seed, password: 'password' })
    worker.addEventListener('message', event => {
      console.log('got something back', event)
    })
    dispatch(didStoreSeed(seed))
  }
}

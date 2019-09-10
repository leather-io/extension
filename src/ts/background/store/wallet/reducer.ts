import { Reducer } from 'redux'
import { WalletActions, WalletState, RESTORE_WALLET, IS_RESTORING_WALLET } from './types'

const initialState: WalletState = {
  seed: null,
  isRestoringWallet: false
}

export const walletReducer: Reducer<WalletState, WalletActions> = (
  state = initialState,
  action: WalletActions
): WalletState => {
  switch (action.type) {
    case RESTORE_WALLET:
      return {
        ...state,
        seed: action.payload,
        isRestoringWallet: false
      }
    case IS_RESTORING_WALLET:
      return {
        ...state,
        isRestoringWallet: true
      }
    default:
      return state
  }
}

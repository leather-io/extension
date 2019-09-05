import { Reducer } from 'redux'
import { WalletActions, WalletState, STORE_SEED } from './types'

const initialState: WalletState = {
  seed: null
}

export const walletReducer: Reducer<WalletState, WalletActions> = (state = initialState, action: WalletActions): WalletState => {
  switch(action.type) {
    case STORE_SEED:
      return {
        ...state,
        seed: action.payload
      }
    default:
      return state
  }
}
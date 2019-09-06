import { WalletActions, STORE_SEED } from './types'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import Wallet from 'blockstack-keychain/lib-esm/wallet'

export function didStoreSeed(seed: string): WalletActions {
  return {
    type: STORE_SEED,
    payload: seed
  }
}

export function doStoreSeed(seed: string): ThunkAction<Promise<Wallet>, {}, {}, WalletActions> {
  return async (dispatch: ThunkDispatch<{}, {}, WalletActions>) => {
    const wallet = await Wallet.restore('password', seed)
    console.log(wallet)

    dispatch(didStoreSeed(seed))
    return wallet
  }
}

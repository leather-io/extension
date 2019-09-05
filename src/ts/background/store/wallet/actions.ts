import { WalletActions, STORE_SEED } from './types'

export function doStoreSeed(seed: string): WalletActions {
  return {
    type: STORE_SEED,
    payload: seed
  }
}
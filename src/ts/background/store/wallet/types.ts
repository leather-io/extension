export const STORE_SEED = 'WALLET/STORE_SEED'

interface StoreSeedAction {
  type: typeof STORE_SEED
  payload: string
}

export interface WalletState {
  seed: string | null
}

export type WalletActions = StoreSeedAction

export const RESTORE_WALLET = 'WALLET/RESTORE_WALLET'
export const IS_RESTORING_WALLET = 'WALLET/IS_RESTORING'

interface StoreSeedAction {
  type: typeof RESTORE_WALLET
  payload: string
}

interface IsRestoringWalletAction {
  type: typeof IS_RESTORING_WALLET
}

export interface WalletState {
  seed: string | null
  isRestoringWallet: boolean
}

export type WalletActions = StoreSeedAction | IsRestoringWalletAction

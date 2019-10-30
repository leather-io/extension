import { IAppState } from '@store'
import Wallet from 'blockstack-keychain/lib-esm/wallet'

export const selectCurrentWallet = (state: IAppState) => {
  return (state.wallet.currentWallet as Wallet)
}
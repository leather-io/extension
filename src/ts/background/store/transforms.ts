// import * as Wallet from '@blockstack/keychain/dist/wallet'
// import { Wallet } from '@blockstack/keychain'
import Keychain from '@blockstack/keychain'
import { ConstructorOptions } from '@blockstack/keychain/dist/wallet'
import { createTransform } from 'redux-persist'

interface OutboundState {
  [key: string]: any
  currentWallet: null | ConstructorOptions
}

export const WalletTransform = createTransform(
  inboundState => {
    return { ...inboundState }
  },
  (outboundState: OutboundState) => {
    if (outboundState.currentWallet) {
      const currentWallet: ConstructorOptions = outboundState.currentWallet
      return {
        ...outboundState,
        currentWallet: new Keychain.Wallet(currentWallet)
      }
    }
    return {
      ...outboundState
    }
  },
  { whitelist: ['wallet'] }
)

import { Wallet } from '@stacks/wallet-sdk';

import { ExtensionMethods, InternalMethods, Message } from '@shared/message-types';

// In-memory (background) wallet instance
export interface InMemorySoftwareWalletVault {
  encryptedSecretKey?: string;
  salt?: string;
  secretKey?: string;
  wallet?: Wallet;
  currentAccountIndex?: number;
  hasSetPassword: boolean;
}

/**
 * Vault <-> Background Script
 */
type VaultMessage<M extends ExtensionMethods, P> = Omit<Message<M, P>, 'source'>;

type GetWallet = VaultMessage<InternalMethods.getWallet, undefined>;
type MakeWallet = VaultMessage<InternalMethods.makeWallet, undefined>;
type CreateNewAccount = VaultMessage<InternalMethods.createNewAccount, undefined>;
type SignOut = VaultMessage<InternalMethods.signOut, undefined>;
type LockWallet = VaultMessage<InternalMethods.lockWallet, undefined>;

export type StoreSeed = VaultMessage<
  InternalMethods.storeSeed,
  { secretKey: string; password?: string }
>;
export type SetPassword = VaultMessage<InternalMethods.setPassword, string>;
export type UnlockWallet = VaultMessage<InternalMethods.unlockWallet, string>;
export type SwitchAccount = VaultMessage<InternalMethods.switchAccount, number>;

export type VaultActions =
  | GetWallet
  | MakeWallet
  | StoreSeed
  | CreateNewAccount
  | SignOut
  | SetPassword
  | UnlockWallet
  | SwitchAccount
  | LockWallet;

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
type BackgroundMessage<Msg extends ExtensionMethods, Payload = undefined> = Omit<
  Message<Msg, Payload>,
  'source'
>;

export type TestMessage = BackgroundMessage<InternalMethods.TestAction, string>;

export type BackgroundActions = TestMessage;

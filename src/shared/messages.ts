import { ExtensionMethods, InternalMethods, Message } from '@shared/message-types';

/**
 * Vault <-> Background Script
 */
type BackgroundMessage<Msg extends ExtensionMethods, Payload = undefined> = Omit<
  Message<Msg, Payload>,
  'source'
>;

export type RequestDerivedStxAccounts = BackgroundMessage<
  InternalMethods.RequestDerivedStxAccounts,
  { secretKey: string; highestAccountIndex: number }
>;

type ShareInMemoryKeyToBackground = BackgroundMessage<
  InternalMethods.ShareInMemoryKeyToBackground,
  { secretKey: string; keyId: string }
>;

type RequestInMemoryKeys = BackgroundMessage<InternalMethods.RequestInMemoryKeys>;

type RemoveInMemoryKeys = BackgroundMessage<InternalMethods.RemoveInMemoryKeys>;

export type RequestAccountsFromWalletSalt = BackgroundMessage<
  InternalMethods.RequestAccountsFromWalletSalt,
  { secretKey: string; salt: string; highestAccountIndex: number }
>;

export type BackgroundActions =
  | RequestDerivedStxAccounts
  | ShareInMemoryKeyToBackground
  | RequestInMemoryKeys
  | RemoveInMemoryKeys
  | RequestAccountsFromWalletSalt;

export function sendMessage(message: BackgroundActions) {
  return chrome.runtime.sendMessage(message);
}

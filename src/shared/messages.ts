import { ExtensionMethods, InternalMethods, Message, MESSAGE_SOURCE } from '@shared/message-types';

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

export type BackgroundActions =
  | RequestDerivedStxAccounts
  | ShareInMemoryKeyToBackground
  | RequestInMemoryKeys
  | RemoveInMemoryKeys;

export function sendMessageToBackground(message: BackgroundActions) {
  return chrome.runtime.sendMessage(message);
}

export function sendMessageToTab(tabId: number, id: string, message: object) {
  return chrome.tabs.sendMessage(tabId, { source: MESSAGE_SOURCE, id, ...message });
}

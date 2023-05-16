import { ExtensionMethods, InternalMethods, Message } from '@shared/message-types';

/**
 * Popup <-> Background Script
 */
type BackgroundMessage<Msg extends ExtensionMethods, Payload = undefined> = Omit<
  Message<Msg, Payload>,
  'source'
>;

export type RequestDerivedStxAccounts = BackgroundMessage<
  InternalMethods.RequestDerivedStxAccounts,
  { secretKey: string; highestAccountIndex: number }
>;

type GetActiveFormState = BackgroundMessage<InternalMethods.GetActiveFormState, { tabId: number }>;

type SetActiveFormState = BackgroundMessage<
  InternalMethods.SetActiveFormState,
  { tabId: number; symbol: string; amount?: string; recipient?: string }
>;

type ClearActiveFormState = BackgroundMessage<
  InternalMethods.ClearActiveFormState,
  { tabId: number }
>;

type FirefoxShareInMemoryKeyToBackground = BackgroundMessage<
  InternalMethods.ShareInMemoryKeyToBackground,
  { secretKey: string; keyId: string }
>;

type FirefoxRequestInMemoryKeys = BackgroundMessage<InternalMethods.RequestInMemoryKeys>;

type FirefoxRemoveInMemoryKeys = BackgroundMessage<InternalMethods.RemoveInMemoryKeys>;

type OriginatingTabClosed = BackgroundMessage<
  InternalMethods.OriginatingTabClosed,
  { tabId: number }
>;

export type BackgroundMessages =
  | RequestDerivedStxAccounts
  | GetActiveFormState
  | SetActiveFormState
  | ClearActiveFormState
  | FirefoxShareInMemoryKeyToBackground
  | FirefoxRequestInMemoryKeys
  | FirefoxRemoveInMemoryKeys
  | OriginatingTabClosed;

export function sendMessage(message: BackgroundMessages) {
  return chrome.runtime.sendMessage(message);
}

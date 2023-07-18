import { ExtensionMethods, InternalMethods, Message } from '@shared/message-types';

/**
 * Popup <-> Background Script
 */
type BackgroundMessage<Msg extends ExtensionMethods, Payload = undefined> = Omit<
  Message<Msg, Payload>,
  'source'
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
  | FirefoxShareInMemoryKeyToBackground
  | FirefoxRequestInMemoryKeys
  | FirefoxRemoveInMemoryKeys
  | OriginatingTabClosed;

export function sendMessage(message: BackgroundMessages) {
  return chrome.runtime.sendMessage(message);
}

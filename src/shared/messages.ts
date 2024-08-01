import { ExtensionMethods, InternalMethods, Message } from '@shared/message-types';

/**
 * Popup <-> Background Script
 */
type BackgroundMessage<Msg extends ExtensionMethods, Payload = undefined> = Omit<
  Message<Msg, Payload>,
  'source'
>;

type OriginatingTabClosed = BackgroundMessage<
  InternalMethods.OriginatingTabClosed,
  { tabId: number }
>;

type AccountChanged = BackgroundMessage<InternalMethods.AccountChanged, { accountIndex: number }>;

export type BackgroundMessages = OriginatingTabClosed | AccountChanged;

export function sendMessage(message: BackgroundMessages) {
  return chrome.runtime.sendMessage(message);
}

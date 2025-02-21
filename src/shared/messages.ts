import { ExtensionMethods, InternalMethods, Message } from '@shared/message-types';

import type { MonitoredAddress } from '@background/monitors/address-monitor';

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

type AddressMonitorUpdated = BackgroundMessage<
  InternalMethods.AddressMonitorUpdated,
  { addresses: MonitoredAddress[] }
>;

export type BackgroundMessages = OriginatingTabClosed | AccountChanged | AddressMonitorUpdated;

export function sendMessage(message: BackgroundMessages) {
  return chrome.runtime.sendMessage(message);
}

import { logger } from '@shared/logger';
import { InternalMethods } from '@shared/message-types';
import { BackgroundMessages } from '@shared/messages';

import { syncAddressMonitor } from '@background/monitors/address-monitor';

function validateMessagesAreFromExtension(sender: chrome.runtime.MessageSender) {
  // Only respond to internal messages from our UI, not content scripts in other applications
  return sender.url?.startsWith(chrome.runtime.getURL(''));
}

function makeFormStateKey(tabId: number) {
  return 'form-state-' + tabId.toString();
}

async function removeFormState(tabId: number) {
  return chrome.storage.session.remove(makeFormStateKey(tabId));
}

// Remove any persisted form state when a tab is closed
chrome.tabs.onRemoved.addListener(tabId => removeFormState(tabId));

function logInternalMessage(message: { method: string }) {
  if (['persist/REHYDRATE', 'persist/PERSIST'].includes(message.method)) return;
  logger.debug('Internal message', message);
}

export async function internalBackgroundMessageHandler(
  message: BackgroundMessages,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) {
  if (!validateMessagesAreFromExtension(sender)) {
    logger.error('Error: Received background script msg from ' + sender.url);
    sendResponse();
    return;
  }

  logInternalMessage(message);

  switch (message.method) {
    case InternalMethods.AddressMonitorUpdated:
      await syncAddressMonitor(message.payload.addresses);
      break;
  }

  if (message.method.includes('bitcoinKeys/signOut')) {
    await syncAddressMonitor([]);
  }

  sendResponse();
}

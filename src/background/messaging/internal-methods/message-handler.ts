import { logger } from '@shared/logger';
import { BackgroundMessages } from '@shared/messages';

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
  logger.debug('Internal message', message);
  sendResponse();
}

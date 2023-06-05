import { deriveStacksAccountsMemoized } from '@shared/crypto/stacks/derive-stacks-accounts';
import { logger } from '@shared/logger';
import { InternalMethods } from '@shared/message-types';
import { BackgroundMessages } from '@shared/messages';

function validateMessagesAreFromExtension(sender: chrome.runtime.MessageSender) {
  // Only respond to internal messages from our UI, not content scripts in other applications
  return sender.url?.startsWith(chrome.runtime.getURL(''));
}

const inMemoryKeys = new Map();

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
  switch (message.method) {
    case InternalMethods.RequestDerivedStxAccounts: {
      const { secretKey, highestAccountIndex } = message.payload;
      const walletsWithAccounts = await deriveStacksAccountsMemoized(
        secretKey,
        highestAccountIndex
      );
      sendResponse(walletsWithAccounts);
      break;
    }

    case InternalMethods.ShareInMemoryKeyToBackground: {
      const { keyId, secretKey } = message.payload;
      inMemoryKeys.set(keyId, secretKey);
      sendResponse();
      break;
    }

    case InternalMethods.RequestInMemoryKeys: {
      sendResponse(Object.fromEntries(inMemoryKeys));
      break;
    }

    // case InternalMethods.GetActiveFormState: {
    //   sendResponse(await chrome.storage.session.get(makeFormStateKey(message.payload.tabId)));
    //   break;
    // }

    // case InternalMethods.SetActiveFormState: {
    //   const { tabId, ...state } = message.payload;
    //   await chrome.storage.session.set({ [makeFormStateKey(tabId)]: state });
    //   sendResponse();
    //   break;
    // }

    // case InternalMethods.ClearActiveFormState: {
    //   await removeFormState(message.payload.tabId);
    //   sendResponse();
    //   break;
    // }

    case InternalMethods.RemoveInMemoryKeys: {
      inMemoryKeys.clear();
      sendResponse();
      break;
    }
  }
}

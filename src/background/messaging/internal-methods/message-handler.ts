// import { StacksMainnet } from '@stacks/network';
import { generateNewAccount, generateWallet } from '@stacks/wallet-sdk';
import memoize from 'promise-memoize';

import { logger } from '@shared/logger';
import { InternalMethods } from '@shared/message-types';
import { BackgroundMessages } from '@shared/messages';

function validateMessagesAreFromExtension(sender: chrome.runtime.MessageSender) {
  // Only respond to internal messages from our UI, not content scripts in other applications
  return sender.url?.startsWith(chrome.runtime.getURL(''));
}

const deriveWalletWithAccounts = memoize(async (secretKey: string, highestAccountIndex: number) => {
  // Here we only want the resulting `Wallet` objects, but the API
  // requires a password (so it can also return an encrypted key)
  const wallet = await generateWallet({ secretKey, password: '' });
  let walWithAccounts = wallet;
  for (let i = 0; i < highestAccountIndex; i++) {
    walWithAccounts = generateNewAccount(walWithAccounts);
  }
  return walWithAccounts;
});

// Persists keys in memory for the duration of the background scripts life
const inMemoryKeys = new Map();

const inMemoryFormState = new Map<number, object>();

// Remove any persisted form state when a tab is closed
chrome.tabs.onRemoved.addListener(tabId => inMemoryFormState.delete(tabId));

export async function internalBackgroundMessageHandler(
  message: BackgroundMessages,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) {
  // console.info('Internal msg', message, validateMessagesAreFromExtension(sender));
  if (!validateMessagesAreFromExtension(sender)) {
    logger.error('Error: Received background script msg from ' + sender.url);
    sendResponse();
    return;
  }
  // logger.debug('Internal message', message);
  switch (message.method) {
    case InternalMethods.RequestDerivedStxAccounts: {
      const { secretKey, highestAccountIndex } = message.payload;
      const walletsWithAccounts = await deriveWalletWithAccounts(secretKey, highestAccountIndex);
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
      sendResponse();
      break;
    }

    case InternalMethods.GetActiveFormState: {
      sendResponse(inMemoryFormState.get(message.payload.tabId));
      break;
    }

    case InternalMethods.SetActiveFormState: {
      const { tabId, ...state } = message.payload;
      inMemoryFormState.set(tabId, state);
      break;
    }

    case InternalMethods.ClearActiveFormState: {
      inMemoryFormState.delete(message.payload.tabId);
      break;
    }

    case InternalMethods.RemoveInMemoryKeys: {
      inMemoryKeys.clear();
      sendResponse();
      break;
    }
  }
  // As browser is instructed that, if there is a response it will be
  // asyncronous, we must always return a response, even if empty
  sendResponse();
}

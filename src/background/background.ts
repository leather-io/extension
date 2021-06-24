/**
 The background script is the extension's event handler; it contains listeners for browser
 events that are important to the extension. It lies dormant until an event is fired then
 performs the instructed logic. An effective background script is only loaded when it is
 needed and unloaded when it goes idle.
 https://developer.chrome.com/docs/extensions/mv3/architecture-overview/#background_script
 */
import { storePayload, StorageKey } from '@common/storage';
import { ScreenPaths } from '@store/common/types';
import {
  CONTENT_SCRIPT_PORT,
  ExternalMethods,
  MessageFromContentScript,
} from '@common/message-types';

import type { VaultActions } from '@background/vault-types';
import { popupCenter } from '@background/popup';
import { vaultMessageHandler } from '@background/vault';

const IS_TEST_ENV = process.env.TEST_ENV === 'true';

const CHROME_STORE_URL =
  'https://chrome.google.com/webstore/detail/stacks-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj/';

function removeStoreTabAfterInstall() {
  chrome.tabs.query({ lastFocusedWindow: true }, async tabs => {
    // Should FF be added here too?
    const appTab = tabs?.find(tab => tab.url === CHROME_STORE_URL);
    if (appTab?.id) {
      await chrome.tabs.remove(appTab.id);
    }
  });
}

// Listen for install event
chrome.runtime.onInstalled.addListener(async details => {
  if (details.reason === 'install' && !IS_TEST_ENV) {
    removeStoreTabAfterInstall();
    await chrome.tabs.create({
      url: chrome.runtime.getURL(`full-page.html#${ScreenPaths.INSTALLED}`),
    });
  }
});

// Listen for connection to the content-script - port for two-way communication
chrome.runtime.onConnect.addListener(port => {
  // Listen for auth and transaction events
  if (port.name === CONTENT_SCRIPT_PORT) {
    port.onMessage.addListener((message: MessageFromContentScript, port) => {
      const { payload } = message;
      switch (message.method) {
        case ExternalMethods.authenticationRequest: {
          void storePayload({
            payload,
            storageKey: StorageKey.authenticationRequests,
            port,
          });
          const path = ScreenPaths.GENERATION;
          const urlParams = new URLSearchParams();
          urlParams.set('authRequest', payload);
          popupCenter({ url: `/popup.html#${path}?${urlParams.toString()}` });
          break;
        }
        case ExternalMethods.transactionRequest: {
          void storePayload({
            payload,
            storageKey: StorageKey.transactionRequests,
            port,
          });
          const path = ScreenPaths.TRANSACTION_POPUP;
          const urlParams = new URLSearchParams();
          urlParams.set('request', payload);
          popupCenter({ url: `/popup.html#${path}?${urlParams.toString()}` });
          break;
        }
        default:
          break;
      }
    });
  }
});

function goBackToApp() {
  chrome.tabs.query({ lastFocusedWindow: true }, async tabs => {
    // Tab in last position (active tab) is the wallet extension
    // Tab in the second to last position should be the app tab
    // However, this is not a guarantee but w/out making changes to
    // connect, not sure how else to accomplish finding the app tab?
    //
    // Option discussed to close the ext tab here, but not
    // sure we want to make that decision for the user?
    const appTabId = tabs[tabs.length - 2].id;
    if (appTabId) {
      await chrome.tabs.update(appTabId, { active: true });
      await chrome.tabs.reload(appTabId);
    }
  });
  return true;
}

// Listen for events triggered by the background memory vault
chrome.runtime.onMessage.addListener((message: VaultActions, sender, sendResponse) => {
  let redirect;
  // Only respond to internal messages from our UI, not content scripts in other applications
  if (!sender.url?.startsWith(chrome.runtime.getURL(''))) return;
  // Go back to app tab after setting password
  if (message.method === 'redirectAfterSetPassword') {
    // Delay redirect for a smoother transition
    const timer = setTimeout(() => {
      redirect = goBackToApp();
    }, 500);

    if (redirect) {
      clearTimeout(timer);
    }
  }
  void vaultMessageHandler(message).then(sendResponse).catch(sendResponse);
  // Return true to specify that we are responding async
  return true;
});

if (IS_TEST_ENV) {
  // Expose a helper function to open a new tab with the wallet from tests
  (window as any).openOptionsPage = function (page: string) {
    const url = chrome.runtime.getURL(`full-page.html#${page}`);
    return url;
  };
}

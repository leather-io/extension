/**
 The background script is the extension's event handler; it contains listeners for browser
 events that are important to the extension. It lies dormant until an event is fired then
 performs the instructed logic. An effective background script is only loaded when it is
 needed and unloaded when it goes idle.
 https://developer.chrome.com/docs/extensions/mv3/architecture-overview/#background_script
 */
import * as Sentry from '@sentry/react';

import { storePayload, StorageKey } from '@shared/utils/storage';
import { RouteUrls } from '@shared/route-urls';
import { addRefererHeaderRequestListener } from '@shared/add-referer-header';
import { initSentry } from '@shared/utils/sentry-init';
import {
  CONTENT_SCRIPT_PORT,
  ExternalMethods,
  MessageFromContentScript,
} from '@shared/message-types';

import { popupCenter } from '@background/popup-center';
import { initContextMenuActions } from '@background/init-context-menus';
import { backgroundMessageHandler } from './message-handler';
import { backupOldWalletSalt } from './backup-old-wallet-salt';

const IS_TEST_ENV = process.env.TEST_ENV === 'true';

initSentry();

initContextMenuActions();
backupOldWalletSalt();
addRefererHeaderRequestListener();

//
// Playwright does not currently support Chrome extension popup testing:
// https://github.com/microsoft/playwright/issues/5593
async function openRequestInFullPage(path: string, urlParams: URLSearchParams) {
  await chrome.tabs.create({
    url: chrome.runtime.getURL(`index.html#${path}?${urlParams.toString()}`),
  });
}

chrome.runtime.onInstalled.addListener(details => {
  Sentry.wrap(async () => {
    if (details.reason === 'install' && !IS_TEST_ENV) {
      await chrome.tabs.create({
        url: chrome.runtime.getURL(`index.html#${RouteUrls.Onboarding}`),
      });
    }
  });
});

// Listen for connection to the content-script - port for two-way communication
chrome.runtime.onConnect.addListener(port =>
  Sentry.wrap(() => {
    // Listen for auth and transaction events
    if (port.name === CONTENT_SCRIPT_PORT) {
      port.onMessage.addListener(async (message: MessageFromContentScript, port) => {
        const { payload } = message;
        switch (message.method) {
          case ExternalMethods.authenticationRequest: {
            void storePayload({
              payload,
              storageKey: StorageKey.authenticationRequests,
              port,
            });
            const path = RouteUrls.Onboarding;
            const urlParams = new URLSearchParams();
            urlParams.set('authRequest', payload);
            if (IS_TEST_ENV) {
              await openRequestInFullPage(path, urlParams);
            } else {
              popupCenter({ url: `/popup-center.html#${path}?${urlParams.toString()}` });
            }
            break;
          }
          case ExternalMethods.structuredDataSignatureRequest: {
            const path = RouteUrls.SignatureRequest; // TODO refactor
            const urlParams = new URLSearchParams();
            if (!port.sender) return;
            const { tab, url } = port.sender;
            if (!tab?.id || !url) return;
            const origin = new URL(url).origin;
            urlParams.set('request', payload);
            urlParams.set('tabId', tab.id.toString());
            urlParams.set('origin', origin);
            urlParams.set('messageType', 'structured');
            if (IS_TEST_ENV) {
              await openRequestInFullPage(path, urlParams);
            } else {
              popupCenter({ url: `/popup-center.html#${path}?${urlParams.toString()}` });
            }
            break;
          }
          case ExternalMethods.signatureRequest: {
            const path = RouteUrls.SignatureRequest;
            const urlParams = new URLSearchParams();
            if (!port.sender) return;
            const { tab, url } = port.sender;
            if (!tab?.id || !url) return;
            const origin = new URL(url).origin;
            urlParams.set('request', payload);
            urlParams.set('tabId', tab.id.toString());
            urlParams.set('origin', origin);
            urlParams.set('messageType', 'utf8');
            if (IS_TEST_ENV) {
              await openRequestInFullPage(path, urlParams);
            } else {
              popupCenter({ url: `/popup-center.html#${path}?${urlParams.toString()}` });
            }
            break;
          }
          case ExternalMethods.transactionRequest: {
            void storePayload({
              payload,
              storageKey: StorageKey.transactionRequests,
              port,
            });
            const path = RouteUrls.TransactionRequest;
            const urlParams = new URLSearchParams();
            urlParams.set('request', payload);
            if (IS_TEST_ENV) {
              await openRequestInFullPage(path, urlParams);
            } else {
              popupCenter({ url: `/popup-center.html#${path}?${urlParams.toString()}` });
            }
            break;
          }
          default:
            break;
        }
      });
    }
  })
);

//
// Events from the popup script
// Listener fn must return `true` to indicate the response will be async
chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>
  Sentry.wrap(() => {
    void backgroundMessageHandler(message, sender, sendResponse);
    return true;
  })
);

if (IS_TEST_ENV) {
  // Expose a helper function to open a new tab with the wallet from tests
  (window as any).openOptionsPage = (page: string) => chrome.runtime.getURL(`index.html#${page}`);
}

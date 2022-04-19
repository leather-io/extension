//
// This file is the entrypoint to the extension's background script
// https://developer.chrome.com/docs/extensions/mv3/architecture-overview/#background_script
import * as Sentry from '@sentry/react';

import { RouteUrls } from '@shared/route-urls';
import { addRefererHeaderRequestListener } from '@shared/add-referer-header';
import { initSentry } from '@shared/utils/sentry-init';
import { logger } from '@shared/logger';
import {
  CONTENT_SCRIPT_PORT,
  LegacyMessageFromContentScript,
  SupportedRpcMessages,
} from '@shared/message-types';

import { initContextMenuActions } from './init-context-menus';
import { internalBackgroundMessageHandler } from './message-handler';
import { backupOldWalletSalt } from './backup-old-wallet-salt';
import {
  handleLegacyExternalMethodFormat,
  inferLegacyMessage,
} from './legacy-external-message-handler';
import { popupCenter } from './popup-center';
import { requestAccounts } from './methods/request-accounts';

void addRefererHeaderRequestListener();
initSentry();
initContextMenuActions();
backupOldWalletSalt();

const IS_TEST_ENV = process.env.TEST_ENV === 'true';

chrome.runtime.onInstalled.addListener(details => {
  Sentry.wrap(async () => {
    if (details.reason === 'install' && !IS_TEST_ENV) {
      await chrome.tabs.create({
        url: chrome.runtime.getURL(`index.html#${RouteUrls.Onboarding}`),
      });
    }
  });
});

//
// Listen for connection to the content-script - port for two-way communication
chrome.runtime.onConnect.addListener(port =>
  Sentry.wrap(() => {
    if (port.name !== CONTENT_SCRIPT_PORT) return;

    port.onMessage.addListener(
      (message: LegacyMessageFromContentScript | SupportedRpcMessages, port) => {
        if (inferLegacyMessage(message)) {
          void handleLegacyExternalMethodFormat(message, port);
          return;
        }

        if (!port.sender?.tab?.id)
          return logger.error('Message reached background script without a corresponding tab');

        if (!port.sender?.origin)
          return logger.error('Message reached background script without a corresponding origin');

        switch (message.method) {
          case ExternalMethods.authenticationRequest: {
            void storePayload({
              payload,
              storageKey: StorageKey.authenticationRequests,
              port,
            });
            const path = RouteUrls.Onboarding;
            if (!port.sender) return;
            const { tab, url } = port.sender;
            if (!tab?.id || !url) return;
            const origin = new URL(url).origin;
            const urlParams = new URLSearchParams();
            urlParams.set('origin', origin);
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
            break;
          case RpcMethods[RpcMethods.stx_requestAccounts]: {
            requestAccounts(port.sender.tab.id, port.sender.origin, message);
            break;
          }
        }
      }
    );
  })
);

//
// Events from the extension frames script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>
  Sentry.wrap(() => {
    void internalBackgroundMessageHandler(message, sender, sendResponse);
    // Listener fn must return `true` to indicate the response will be async
    return true;
  })
);

if (IS_TEST_ENV) {
  // Expose a helper function to open a new tab with the wallet from tests
  (window as any).openOptionsPage = (page: string) => chrome.runtime.getURL(`index.html#${page}`);
}

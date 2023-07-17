//
// This file is the entrypoint to the extension's background script
// https://developer.chrome.com/docs/extensions/mv3/architecture-overview/#background_script
import { logger } from '@shared/logger';
import { CONTENT_SCRIPT_PORT } from '@shared/message-types';
import type { LegacyMessageFromContentScript } from '@shared/message-types';
import { RouteUrls } from '@shared/route-urls';
import { WalletRequests } from '@shared/rpc/rpc-methods';
import { warnUsersAboutDevToolsDangers } from '@shared/utils/dev-tools-warning-log';

import { initContextMenuActions } from './init-context-menus';
import { internalBackgroundMessageHandler } from './messaging/internal-methods/message-handler';
import {
  handleLegacyExternalMethodFormat,
  isLegacyMessage,
} from './messaging/legacy/legacy-external-message-handler';
import { rpcMessageHandler } from './messaging/rpc-message-handler';

initContextMenuActions();
warnUsersAboutDevToolsDangers();

const IS_TEST_ENV = process.env.TEST_ENV === 'true';

chrome.runtime.onInstalled.addListener(async details => {
  if (details.reason === 'install' && !IS_TEST_ENV) {
    await chrome.tabs.create({
      url: chrome.runtime.getURL(`index.html#${RouteUrls.RequestDiagnostics}`),
    });
  }
});

// https://bugs.chromium.org/p/chromium/issues/detail?id=1271154#c108
chrome.runtime.onStartup.addListener(() =>
  // eslint-disable-next-line no-console
  console.log('Service Worker startup')
);

//
// Listen for connection to the content-script - port for two-way communication
chrome.runtime.onConnect.addListener(port => {
  if (port.name !== CONTENT_SCRIPT_PORT) return;

  port.onMessage.addListener((message: LegacyMessageFromContentScript | WalletRequests, port) => {
    if (!port.sender?.tab?.id)
      return logger.error('Message reached background script without a corresponding tab');

    // Chromium/Firefox discrepancy
    const originUrl = port.sender?.origin ?? port.sender?.url;

    if (!originUrl)
      return logger.error('Message reached background script without a corresponding origin');

    // Legacy JWT format messages
    if (isLegacyMessage(message)) {
      void handleLegacyExternalMethodFormat(message, port);
      return;
    }

    // TODO:
    // Here we'll handle all messages using the rpc style comm method
    // For now all messages are handled as legacy format
    void rpcMessageHandler(message, port);
  });
});

//
// Events from the extension frames script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  void internalBackgroundMessageHandler(message, sender, sendResponse);
  // Listener fn must return `true` to indicate the response will be async
  return true;
});

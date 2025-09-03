//
// This file is the entrypoint to the extension's background script
// https://developer.chrome.com/docs/extensions/mv3/architecture-overview/#background_script
import type { RpcRequests } from '@leather.io/rpc';

import { listenForSessionDurationPort } from '@shared/analytics/session-duration-tracking';
import { logger } from '@shared/logger';
import { CONTENT_SCRIPT_PORT, type LegacyMessageFromContentScript } from '@shared/message-types';
import { warnUsersAboutDevToolsDangers } from '@shared/utils/dev-tools-warning-log';

import { queueAnalyticsRequest } from './background-analytics';
import { initContextMenuActions } from './init-context-menus';
import { internalBackgroundMessageHandler } from './messaging/internal-methods/message-handler';
import {
  handleLegacyExternalMethodFormat,
  isLegacyMessage,
} from './messaging/legacy/legacy-external-message-handler';
import { rpcMessageHandler } from './messaging/rpc-message-handler';
import { rpcRequestSchema } from './messaging/rpc-request-utils';
import { initAddressMonitor } from './monitors/address-monitor';

initContextMenuActions();
warnUsersAboutDevToolsDangers();

initAddressMonitor().catch(e => {
  logger.error('Unable to Initialise Address Monitor: ', e);
});

listenForSessionDurationPort({
  onSessionEnd(sessionMetadata) {
    void queueAnalyticsRequest('user_session_complete', sessionMetadata);
  },
});

chrome.runtime.onInstalled.addListener(async details => {
  if (details.reason === 'install' && process.env.WALLET_ENVIRONMENT !== 'testing') {
    await chrome.tabs.create({
      url: chrome.runtime.getURL(`index.html`),
    });
  }
});

// Listen for connection to the content-script - port for two-way communication
chrome.runtime.onConnect.addListener(port => {
  if (port.name !== CONTENT_SCRIPT_PORT) return;

  port.onMessage.addListener((message: LegacyMessageFromContentScript | RpcRequests, port) => {
    if (!port.sender || !port.sender?.tab?.id)
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
    void rpcMessageHandler(message, port.sender);
  });
});

//
// Events from the extension frames script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (rpcRequestSchema.safeParse(message).success) {
    void rpcMessageHandler(message, sender);
    return true;
  }

  void internalBackgroundMessageHandler(message, sender, sendResponse);

  // Listener fn must return `true` to indicate the response will be async
  return true;
});

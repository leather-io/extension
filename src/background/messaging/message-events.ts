import * as Sentry from '@sentry/react';
import { Subject, fromEventPattern } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { CONTENT_SCRIPT_PORT, LegacyMessageFromContentScript } from '@shared/message-types';
import { WalletRequests } from '@shared/rpc/rpc-methods';

const IS_TEST_ENV = process.env.TEST_ENV === 'true';

export const install$ = fromEventPattern<chrome.runtime.InstalledDetails>(handler =>
  chrome.runtime.onInstalled.addListener(handler)
).pipe(filter(detail => detail.reason === 'install' && !IS_TEST_ENV));

export const message$ = fromEventPattern(
  handler =>
    chrome.runtime.onMessage.addListener((...args) =>
      Sentry.wrap(() => {
        handler(...args);
        return true;
      })
    ),
  handler => chrome.runtime.onMessage.removeListener(handler),
  (message, sender: chrome.runtime.MessageSender, sendResponse: () => void) => ({
    message,
    sender,
    sendResponse,
  })
);

const connect$ = fromEventPattern<chrome.runtime.Port>(
  handler => chrome.runtime.onConnect.addListener(handler),
  handler => chrome.runtime.onConnect.removeListener(handler)
);

//
// Listen for connection to the content-script - port for two-way communication
export const contentScriptMessage$ = connect$.pipe(
  filter(port => port.name === CONTENT_SCRIPT_PORT),
  switchMap(port =>
    fromEventPattern(
      handler => port.onMessage.addListener(handler),
      handler => port.onMessage.removeListener(handler),
      (message: LegacyMessageFromContentScript | WalletRequests, port: chrome.runtime.Port) => ({
        message,
        port,
      })
    )
  )
);

export const rpcMessages$ = new Subject<{ message: WalletRequests; port: chrome.runtime.Port }>();

export const legacyMessage$ = new Subject<{
  message: LegacyMessageFromContentScript;
  port: chrome.runtime.Port;
}>();

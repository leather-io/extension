import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';
import { initSentry } from '@shared/utils/analytics';
import { warnUsersAboutDevToolsDangers } from '@shared/utils/dev-tools-warning-log';

import { backupOldWalletSalt } from './backup-old-wallet-salt';
import { initContextMenuActions } from './init-context-menus';
import { isLegacyMessage } from './messaging/legacy-external-message-handler';
import {
  contentScriptMessage$,
  install$,
  legacyMessage$,
  message$,
  rpcMessages$,
} from './messaging/message-events';
import { internalBackgroundMessageHandler } from './messaging/message-handler';

initSentry();
initContextMenuActions();
backupOldWalletSalt();
warnUsersAboutDevToolsDangers();

const IS_TEST_ENV = process.env.TEST_ENV === 'true';

install$.subscribe(
  () =>
    void chrome.tabs.create({
      url: chrome.runtime.getURL(`index.html#${RouteUrls.Onboarding}`),
    })
);

contentScriptMessage$.subscribe(({ message, port }) => {
  if (!port.sender?.tab?.id)
    return logger.error('Message reached background script without a corresponding tab');

  // Chromium/Firefox discrepancy
  const originUrl = port.sender.origin ?? port.sender.url;

  if (!originUrl)
    return logger.error('Message reached background script without a corresponding origin');

  if (isLegacyMessage(message)) {
    legacyMessage$.next({ message, port });
    return;
  }

  rpcMessages$.next({ message, port });
});

message$.subscribe(({ message, sender, sendResponse }) =>
  internalBackgroundMessageHandler(message, sender, sendResponse)
);

if (IS_TEST_ENV) {
  // Expose a helper function to open a new tab with the wallet from tests
  (window as any).openOptionsPage = (page: string) => chrome.runtime.getURL(`index.html#${page}`);
}

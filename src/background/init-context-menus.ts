import { openNewTabWalletPage } from '@shared/utils/open-wallet-page';

export function initContextMenuActions() {
  chrome.contextMenus.removeAll();

  chrome.contextMenus.create({
    title: 'Open Hiro Wallet in a new tab',
    contexts: ['browser_action'],
    async onclick() {
      await openNewTabWalletPage();
    },
  });
}

function openNewTabWithWallet() {
  return chrome.tabs.create({ url: 'index.html' });
}

export function initContextMenuActions() {
  chrome.contextMenus.removeAll();

  chrome.contextMenus.create({
    id: 'open_in_new_tab',
    title: 'Open Hiro Wallet in a new tab',
    contexts: ['action'],
  });
}

chrome.contextMenus.onClicked.addListener(async args => {
  if (args.menuItemId === 'open_in_new_tab') {
    await openNewTabWithWallet();
  }
});

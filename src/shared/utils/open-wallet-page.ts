export function openNewTabWalletPage() {
  return chrome.tabs.create({ url: 'index.html' });
}

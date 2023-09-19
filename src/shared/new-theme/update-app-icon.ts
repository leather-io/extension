import get from 'lodash.get';

export async function userHasApprovedAppIcon() {
  const resp = await chrome.storage.local.get('persist:root');
  const store = resp['persist:root'];
  return get(store, 'settings.hasApprovedNewBrand', false);
}

export async function setNewAppIcon() {
  if (process.env.WALLET_ENVIRONMENT !== 'production') {
    await chrome.action.setIcon({ path: 'assets/icons/leather-icon-128-dev.png' });
    return;
  }
  await chrome.action.setIcon({ path: 'assets/icons/leather-icon-128.png' });
}

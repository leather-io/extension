const newIconStoreKey = 'hasApprovedAppIcon';

export async function userHasApprovedAppIcon() {
  const { hasApprovedAppIcon } = await chrome.storage.local.get(newIconStoreKey);
  return !!hasApprovedAppIcon;
}

export async function setNewAppIcon() {
  await chrome.action.setIcon({ path: 'assets/connect-logo/Stacks128w-preview.png' });
}

export async function userApprovedNewAppIcon() {
  await chrome.storage.local.set({ [newIconStoreKey]: true });
}

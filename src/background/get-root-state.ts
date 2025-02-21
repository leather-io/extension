export async function getRootState() {
  const storage = await chrome.storage.local.get(['persist:root']);
  if (!storage) return;
  return storage['persist:root'];
}

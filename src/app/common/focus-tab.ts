export function focusTabAndWindow(tabId: number | null) {
  chrome.tabs.update(tabId ?? 0, { active: true }, tab => {
    if (!tab) return;
    chrome.windows.update(tab.windowId, { focused: true });
  });
}

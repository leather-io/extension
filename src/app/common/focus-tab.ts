import { analytics } from '@shared/utils/analytics';

export function focusInitatingTab(tabId: number | null) {
  void analytics.track('user_clicked_requested_by_link', { endpoint: 'getAddresses' });
  chrome.tabs.update(tabId ?? 0, { active: true }, tab => {
    if (!tab) return;
    chrome.windows.update(tab.windowId, { focused: true });
  });
}

export function getActiveTab(): Promise<chrome.tabs.Tab> {
  return new Promise(resolve =>
    chrome.tabs.query({ currentWindow: true, active: true }, tabs => resolve(tabs[0]))
  );
}

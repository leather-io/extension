type BrowserRuntime = 'chromium' | 'firefox';

function getBrowserRuntime(): BrowserRuntime {
  return chrome.runtime.getURL('').startsWith('moz-extension://') ? 'firefox' : 'chromium';
}

type WhenBrowserRuntimeMap<T> = Record<BrowserRuntime, T>;

export function whenBrowserRuntime<T>(runtimeMap: WhenBrowserRuntimeMap<T>) {
  return runtimeMap[getBrowserRuntime()];
}

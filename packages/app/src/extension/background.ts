import { wrapStore } from 'webext-redux';
import { ScreenPaths } from '@store/onboarding/types';
import { store } from '../store';
import { walletDeserializer } from '../store/ext-store';

wrapStore(store, {
  portName: 'ExPort', // Communication port between the background component and views such as browser tabs.
  deserializer: (payload: any) => JSON.parse(payload, walletDeserializer),
  serializer: (payload: any) => JSON.stringify(payload),
});

// chrome.browserAction.onClicked.addListener(() => {
//   chrome.runtime.openOptionsPage();
// });

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: chrome.runtime.getURL(`index.html#${ScreenPaths.INSTALLED}`) });
  }
});

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: chrome.runtime.getURL(`index.html#${ScreenPaths.INSTALLED}`) });
  }
});

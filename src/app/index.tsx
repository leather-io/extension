import ReactDOM from 'react-dom';

import { InternalMethods } from '@shared/message-types';
import { initSentry } from '@shared/utils/analytics';
import { warnUsersAboutDevToolsDangers } from '@shared/utils/dev-tools-warning-log';

import { persistAndRenderApp } from '@app/common/persistence';

import { App } from './app';
import { store } from './store';
import { inMemoryKeyActions } from './store/in-memory-key/in-memory-key.actions';

initSentry();
warnUsersAboutDevToolsDangers();

declare global {
  interface Window {
    __APP_VERSION__: string;
  }
}

window.__APP_VERSION__ = VERSION;

async function checkForInMemoryKeys() {
  return new Promise(resolve =>
    chrome.runtime.sendMessage({ method: InternalMethods.RequestInMemoryKeys }, resp => {
      if (Object.keys(resp).length === 0) return resolve(true);
      store.dispatch(inMemoryKeyActions.setKeysInMemory(resp));
      resolve(true);
    })
  );
}

async function renderApp() {
  await checkForInMemoryKeys();
  return ReactDOM.render(<App />, document.getElementById('app'));
}

void persistAndRenderApp(renderApp);

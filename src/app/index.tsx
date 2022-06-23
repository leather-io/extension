import ReactDOM from 'react-dom';

import { persistAndRenderApp } from '@app/common/persistence';
import { initSentry } from '@shared/utils/sentry-init';
import { InternalMethods } from '@shared/message-types';
import { addRefererHeaderRequestListener } from '@shared/add-referer-header';

import { inMemoryKeyActions } from './store/in-memory-key/in-memory-key.actions';
import { initSegment } from './common/segment-init';
import { store } from './store';
import { App } from './app';

initSentry();
void initSegment();
addRefererHeaderRequestListener();

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

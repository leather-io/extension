import ReactDOM from 'react-dom';
import { App } from './app';

import { persistAndRenderApp } from '@app/common/persistence';
import { initSentry } from '@shared/utils/sentry-init';
import { initSegment } from './common/segment-init';
import { store } from './store';
import { InternalMethods } from '@shared/message-types';
import { inMemoryKeyActions } from './store/in-memory-key/in-memory-key.actions';

initSentry();
void initSegment();

declare global {
  interface Window {
    __APP_VERSION__: string;
  }
}

window.__APP_VERSION__ = VERSION;

async function checkForInMemoryKeys() {
  return new Promise(resolve =>
    chrome.runtime.sendMessage({ method: InternalMethods.RequestInMemoryKeys }, resp => {
      store.dispatch(inMemoryKeyActions.setKeysInMemory(!resp ? {} : resp));
      resolve(true);
    })
  );
}

async function renderApp() {
  await checkForInMemoryKeys();
  return ReactDOM.render(<App />, document.getElementById('app'));
}

void persistAndRenderApp(renderApp);

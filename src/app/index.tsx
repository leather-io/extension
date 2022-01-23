import ReactDOM from 'react-dom';
import { App } from './app';

import { persistAndRenderApp } from '@app/common/persistence';
import { initSentry } from '@shared/utils/sentry-init';
import { initSegment } from './common/segment-init';

initSentry();
void initSegment();

declare global {
  interface Window {
    __APP_VERSION__: string;
  }
}

window.__APP_VERSION__ = VERSION;

async function renderApp() {
  return ReactDOM.render(<App />, document.getElementById('app'));
}

void persistAndRenderApp(renderApp);

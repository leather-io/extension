import ReactDOM from 'react-dom';

import { persistAndRenderApp } from '@app/common/persistence';
import { initSentry } from '@shared/utils/sentry-init';

import { App } from './app';

initSentry();

function renderApp() {
  ReactDOM.render(<App />, document.getElementById('app'));
}

void persistAndRenderApp(renderApp);

import ReactDOM from 'react-dom';
import { App } from './app';

import { persistAndRenderApp } from '@app/common/persistence';
import { initSentry } from '@shared/utils/sentry-init';

initSentry();

function renderApp() {
  ReactDOM.render(<App />, document.getElementById('actions-root'));
}

void persistAndRenderApp(renderApp);

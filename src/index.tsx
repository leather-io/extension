import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

import { persistAndRenderApp } from '@common/persistence';
import { initSentry } from '@common/sentry-init';

initSentry();

function renderApp() {
  ReactDOM.render(<App />, document.getElementById('actions-root'));
}

void persistAndRenderApp(renderApp);

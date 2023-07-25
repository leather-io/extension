import { createRoot } from 'react-dom/client';

// import { HashRouter } from 'react-router-dom';
import { initSentry } from '@shared/utils/analytics';
import { warnUsersAboutDevToolsDangers } from '@shared/utils/dev-tools-warning-log';

import { persistAndRenderApp } from '@app/common/persistence';
import { restoreWalletSession } from '@app/store/session-restore';

import { App } from './app';
import { setDebugOnGlobal } from './debug';

// import { useAppRoutes } from './routes/app-routes';

initSentry();
warnUsersAboutDevToolsDangers();
setDebugOnGlobal();

declare global {
  interface Window {
    __APP_VERSION__: string;
  }
}

window.__APP_VERSION__ = VERSION;

async function renderApp() {
  await restoreWalletSession();
  const container = document.getElementById('app');
  const newElement = document.createElement('div');
  newElement.id = 'portal';
  container?.appendChild(newElement);

  return createRoot(container!).render(
    // <HashRouter>
    <App />
    // </HashRouter>
  );
}

void persistAndRenderApp(renderApp);

import { createRoot } from 'react-dom/client';

import { initSentry } from '@shared/utils/analytics';
import { warnUsersAboutDevToolsDangers } from '@shared/utils/dev-tools-warning-log';

import { persistAndRenderApp } from '@app/common/persistence';
import { restoreWalletSession } from '@app/store/session-restore';

import { App } from './app';
import { setDebugOnGlobal } from './debug';

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
  return createRoot(container!).render(<App />);
}

void persistAndRenderApp(renderApp);

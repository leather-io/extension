import { createRoot } from 'react-dom/client';

import ecc from '@bitcoinerlab/secp256k1';
import * as bitcoin from 'bitcoinjs-lib';

import { initSentry } from '@shared/utils/analytics';
import { warnUsersAboutDevToolsDangers } from '@shared/utils/dev-tools-warning-log';

import { persistAndRenderApp } from '@app/common/persistence';
import { restoreWalletSession } from '@app/store/session-restore';

import { App } from './app';
import { setDebugOnGlobal } from './debug';

// `bitcoinjs-lib` requires an elliptic curve library to be initialized, here we
// do it globally for the entire app.
bitcoin.initEccLib(ecc);

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

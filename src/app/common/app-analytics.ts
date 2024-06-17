import { useEffect } from 'react';

import { HIRO_API_BASE_URL_MAINNET, HIRO_API_BASE_URL_TESTNET } from '@leather-wallet/models';

import { IS_TEST_ENV, SEGMENT_WRITE_KEY } from '@shared/environment';
import { decorateAnalyticsEventsWithContext, initAnalytics } from '@shared/utils/analytics';

import { store } from '@app/store';
import { selectWalletType } from '@app/store/common/wallet-type.selectors';
import { selectCurrentNetwork } from '@app/store/networks/networks.selectors';

import { flow, origin } from './initial-search-params';

const defaultStaticAnalyticContext = {
  ip: '0.0.0.0',
  platform: 'web',
  product: 'extension',
  route: location.pathname,
  version: VERSION,
  ...(flow && { flow }),
  ...(origin && { origin }),
};

function getAnalyticsStateProps() {
  const state = store.getState();
  const currentNetwork = selectCurrentNetwork(state);
  const walletType = selectWalletType(state);

  return {
    walletType,
    currentNetwork,
  };
}

function isHiroApiUrl(url: string) {
  return url.includes(HIRO_API_BASE_URL_MAINNET) || url.includes(HIRO_API_BASE_URL_TESTNET);
}

function getDerivedStateAnalyticsContext() {
  const appState = getAnalyticsStateProps();

  return {
    network: appState.currentNetwork.name.toLowerCase(),
    usingDefaultHiroApi: isHiroApiUrl(appState.currentNetwork.chain.stacks.url),
    walletType: appState.walletType,
  };
}

export function useInitalizeAnalytics() {
  useEffect(() => {
    if (!SEGMENT_WRITE_KEY || IS_TEST_ENV) return;
    initAnalytics();
  }, []);
}

decorateAnalyticsEventsWithContext(() => ({
  ...defaultStaticAnalyticContext,
  ...getDerivedStateAnalyticsContext(),
}));

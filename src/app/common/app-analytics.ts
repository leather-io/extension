import { useEffect } from 'react';

import { z } from 'zod';

import { HIRO_API_BASE_URL_MAINNET, HIRO_API_BASE_URL_TESTNET } from '@leather.io/models';

import { IS_TEST_ENV, SEGMENT_WRITE_KEY } from '@shared/environment';
import {
  analytics,
  decorateAnalyticsEventsWithContext,
  initAnalytics,
} from '@shared/utils/analytics';

import { store } from '@app/store';
import { selectWalletType } from '@app/store/common/wallet-type.selectors';
import { selectCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useOnMount } from './hooks/use-on-mount';
import { flow, origin } from './initial-search-params';

const defaultStaticAnalyticContext = {
  ip: '0.0.0.0',
  platform: 'web',
  product: 'extension',
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
    route: location.pathname,
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

const analyticsQueueItemSchema = z.object({
  eventName: z.string(),
  properties: z.record(z.unknown()).optional(),
});

const analyicsQueueSchema = z.array(analyticsQueueItemSchema);

const analyticsEventKey = 'backgroundAnalyticsRequests';

export function useHandleQueuedBackgroundAnalytics() {
  useOnMount(() => {
    async function handleQueuedAnalytics() {
      const queuedEventsStore = await chrome.storage.local.get(analyticsEventKey);

      try {
        const events = analyicsQueueSchema.parse(queuedEventsStore[analyticsEventKey] ?? []);
        if (!events.length) return;
        await chrome.storage.local.remove(analyticsEventKey);
        await Promise.all(
          events.map(({ eventName, properties }) => analytics.untypedTrack(eventName, properties))
        );
      } catch (e) {
        void analytics.track('background_analytics_schema_fail');
      }
    }
    void handleQueuedAnalytics();
  });
}

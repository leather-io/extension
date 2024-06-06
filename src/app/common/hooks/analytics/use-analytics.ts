import { useEffect, useMemo } from 'react';

import type { NetworkConfiguration } from '@leather-wallet/models';
import {
  EventParams,
  PageParams,
} from '@segment/analytics-next/dist/types/core/arguments-resolver';

import { HIRO_API_BASE_URL_MAINNET, HIRO_API_BASE_URL_TESTNET } from '@shared/constants';
import { IS_TEST_ENV, SEGMENT_WRITE_KEY } from '@shared/environment';
import { logger } from '@shared/logger';
import { analytics, initAnalytics } from '@shared/utils/analytics';

import { flow, origin } from '@app/common/initial-search-params';
import { useWalletType } from '@app/common/use-wallet-type';
import { store } from '@app/store';
import { type WalletType, selectWalletType } from '@app/store/common/wallet-type.selectors';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';
import { selectCurrentNetwork } from '@app/store/networks/networks.selectors';

const IGNORED_PATH_REGEXPS = [/^\/$/];

function isIgnoredPath(path: string) {
  return IGNORED_PATH_REGEXPS.find(regexp => regexp.test(path));
}

function isHiroApiUrl(url: string) {
  return url.includes(HIRO_API_BASE_URL_MAINNET) || url.includes(HIRO_API_BASE_URL_TESTNET);
}

export function useInitalizeAnalytics() {
  useEffect(() => {
    if (!SEGMENT_WRITE_KEY || IS_TEST_ENV) return;
    initAnalytics();
  }, []);
}

function getStateProps() {
  const state = store.getState();
  const currentNetwork = selectCurrentNetwork(state);
  const walletType = selectWalletType(state);

  return {
    walletType,
    currentNetwork,
  };
}

interface Analytics {
  identify(properties: object): Promise<unknown>;
  page(...args: PageParams): Promise<unknown>;
  track(...args: EventParams): Promise<unknown>;
}

export function createAnalytics(suppliedOptions?: {
  currentNetwork: NetworkConfiguration;
  walletType?: WalletType;
}): Analytics {
  const options = suppliedOptions ?? getStateProps();
  const defaultProperties = {
    network: options.currentNetwork.name.toLowerCase(),
    usingDefaultHiroApi: isHiroApiUrl(options.currentNetwork.chain.stacks.url),
    route: location.pathname,
    version: VERSION,
    walletType: options.walletType,
    ...(flow && { flow }),
    ...(origin && { origin }),
  };

  const defaultOptions = { context: { ip: '0.0.0.0' } };

  return {
    async identify(properties) {
      return analytics.identify(properties).catch(logger.error);
    },

    async page(...args) {
      const [category, name, properties, options, ...rest] = args;
      const prop = { ...defaultProperties, ...properties };
      const opts = { ...defaultOptions, ...options };
      logger.debug(`Analytics page view: ${name}`, properties);

      if (typeof name === 'string' && isIgnoredPath(name)) return;

      return analytics.page(category, name, prop, opts, ...rest).catch(logger.error);
    },

    async track(...args) {
      const [eventName, properties, options, ...rest] = args;
      const prop = { ...defaultProperties, ...properties };
      const opts = { ...defaultOptions, ...options };
      logger.debug(`Analytics event: ${eventName}`, properties);
      return analytics.track(eventName, prop, opts, ...rest).catch(logger.error);
    },
  };
}

export function useAnalytics() {
  const currentNetwork = useCurrentNetworkState();
  const { walletType } = useWalletType();

  return useMemo(
    () => createAnalytics({ currentNetwork, walletType }),
    [currentNetwork, walletType]
  );
}

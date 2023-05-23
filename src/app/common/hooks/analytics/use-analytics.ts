import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

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
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';
import { useHasUserExplicitlyDeclinedAnalytics } from '@app/store/settings/settings.selectors';

const IGNORED_PATH_REGEXPS = [/^\/$/];

function isIgnoredPath(path: string) {
  return IGNORED_PATH_REGEXPS.find(regexp => regexp.test(path));
}

function isHiroApiUrl(url: string) {
  return url.includes(HIRO_API_BASE_URL_MAINNET) || url.includes(HIRO_API_BASE_URL_TESTNET);
}

export function useInitalizeAnalytics() {
  const hasUserDeclinedAnalytics = useHasUserExplicitlyDeclinedAnalytics();

  useEffect(() => {
    if (hasUserDeclinedAnalytics || !SEGMENT_WRITE_KEY || IS_TEST_ENV) return;
    initAnalytics();
  }, [hasUserDeclinedAnalytics]);
}

export function useAnalytics() {
  const currentNetwork = useCurrentNetworkState();
  const location = useLocation();
  const { walletType } = useWalletType();

  return useMemo(() => {
    const defaultProperties = {
      network: currentNetwork.name.toLowerCase(),
      usingDefaultHiroApi: isHiroApiUrl(currentNetwork.chain.stacks.url),
      route: location.pathname,
      version: VERSION,
      walletType,
      ...(flow && { flow }),
      ...(origin && { origin }),
    };

    const defaultOptions = { context: { ip: '0.0.0.0' } };

    return {
      async identify(properties: object) {
        return analytics.identify(properties).catch(logger.error);
      },

      async page(...args: PageParams) {
        const [category, name, properties, options, ...rest] = args;
        const prop = { ...defaultProperties, ...properties };
        const opts = { ...defaultOptions, ...options };
        logger.debug(`Analytics page view: ${name}`, properties);

        if (typeof name === 'string' && isIgnoredPath(name)) return;

        return analytics.page(category, name, prop, opts, ...rest).catch(logger.error);
      },

      async track(...args: EventParams) {
        const [eventName, properties, options, ...rest] = args;
        const prop = { ...defaultProperties, ...properties };
        const opts = { ...defaultOptions, ...options };
        logger.debug(`Analytics event: ${eventName}`, properties);

        return analytics.track(eventName, prop, opts, ...rest).catch(logger.error);
      },
    };
  }, [currentNetwork.chain.stacks.url, currentNetwork.name, location.pathname, walletType]);
}

import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import {
  EventParams,
  PageParams,
} from '@segment/analytics-next/dist/types/core/arguments-resolver';

import { IS_TEST_ENV } from '@shared/environment';
import { flow, referringAppDomain } from '@shared/initial-params';
import { logger } from '@shared/logger';
import { analytics } from '@shared/utils/analytics';

import { useWalletType } from '@app/common/use-wallet-type';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';
import { useHasUserExplicitlyDeclinedAnalytics } from '@app/store/settings/settings.selectors';

const IGNORED_PATH_REGEXPS = [/^\/$/];

function isIgnoredPath(path: string) {
  return IGNORED_PATH_REGEXPS.find(regexp => regexp.test(path));
}

function isHiroApiUrl(url: string) {
  return /^https:\/\/.*\.stacks.co/.test(url);
}

export function useAnalytics() {
  const currentNetwork = useCurrentNetworkState();
  const location = useLocation();
  const { walletType } = useWalletType();

  const hasDeclined = useHasUserExplicitlyDeclinedAnalytics();

  return useMemo(() => {
    const defaultProperties = {
      network: currentNetwork.name.toLowerCase(),
      usingDefaultHiroApi: isHiroApiUrl(currentNetwork.chain.stacks.url),
      route: location.pathname,
      version: VERSION,
      walletType,
      ...(flow && { flow }),
      ...(referringAppDomain && { referringAppDomain }),
    };

    const defaultOptions = {
      context: { ip: '0.0.0.0' },
    };

    return {
      async page(...args: PageParams) {
        const [category, name, properties, options, ...rest] = args;
        const prop = { ...defaultProperties, ...properties };
        const opts = { ...defaultOptions, ...options };
        logger.info(`Analytics page view: ${name}`, properties);

        if (!analytics) return;
        if (hasDeclined) return;
        if (IS_TEST_ENV) return;
        if (typeof name === 'string' && isIgnoredPath(name)) return;

        return analytics.page(category, name, prop, opts, ...rest).catch(logger.error);
      },
      async track(...args: EventParams) {
        const [eventName, properties, options, ...rest] = args;
        const prop = { ...defaultProperties, ...properties };
        const opts = { ...defaultOptions, ...options };
        logger.info(`Analytics event: ${eventName}`, properties);

        if (!analytics) return;
        if (hasDeclined) return;
        if (IS_TEST_ENV) return;

        return analytics.track(eventName, prop, opts, ...rest).catch(logger.error);
      },
    };
  }, [
    currentNetwork.chain.stacks.url,
    currentNetwork.name,
    location.pathname,
    walletType,
    hasDeclined,
  ]);
}

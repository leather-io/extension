import { useCurrentNetworkState } from '@app/store/network/networks.hooks';
import { useLocation } from 'react-router-dom';
import { IS_TEST_ENV } from '@shared/constants';
import { EventParams, PageParams } from '@segment/analytics-next/dist/pkg/core/arguments-resolver';
import { analytics } from '@app/common/segment-init';
import { logger } from '@shared/logger';
import { useWalletType } from '@app/common/use-wallet-type';

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

  const defaultProperties = {
    network: currentNetwork.name.toLowerCase(),
    usingDefaultHiroApi: isHiroApiUrl(currentNetwork.url),
    route: location.pathname,
    version: VERSION,
    walletType,
  };

  const defaultOptions = {
    context: { ip: '0.0.0.0' },
  };

  return {
    page: async (...args: PageParams) => {
      if (!analytics || IS_TEST_ENV) return;
      const [category, name, properties, options, ...rest] = args;

      if (typeof name === 'string' && isIgnoredPath(name)) return;

      const prop = { ...defaultProperties, ...properties };
      const opts = { ...defaultOptions, ...options };

      return analytics.page(category, name, prop, opts, ...rest).catch(logger.error);
    },
    track: async (...args: EventParams) => {
      if (!analytics || IS_TEST_ENV) return;
      const [eventName, properties, options, ...rest] = args;

      const prop = { ...defaultProperties, ...properties };
      const opts = { ...defaultOptions, ...options };

      return analytics.track(eventName, prop, opts, ...rest).catch(logger.error);
    },
  };
}

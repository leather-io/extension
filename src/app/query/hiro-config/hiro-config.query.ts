import { GITHUB_ORG, GITHUB_REPO } from '@shared/constants';
import { useQuery } from 'react-query';

export interface HiroMessage {
  title: string;
  text: string;
  purpose: 'error' | 'info' | 'warning';
  publishedAt: string;
  dismissible: boolean;
  learnMoreUrl?: string;
}

interface ActiveFiatProviderType {
  name: string;
  enabled: boolean;
}

interface HiroConfig {
  messages: any;
  activeFiatProviders: Record<string, ActiveFiatProviderType>;
}

const GITHUB_PRIMARY_BRANCH = 'dev';
const githubWalletConfigRawUrl = `https://raw.githubusercontent.com/${GITHUB_ORG}/${GITHUB_REPO}/${GITHUB_PRIMARY_BRANCH}/config/wallet-config.json`;

async function fetchHiroMessages(): Promise<HiroConfig> {
  return fetch(githubWalletConfigRawUrl).then(msg => msg.json());
}

export function useRemoteHiroConfig() {
  const { data } = useQuery(['walletConfig'], fetchHiroMessages, {
    // As we're fetching from Github, a third-party, we want
    // to avoid any unnecessary stress on their services, so
    // we use quite slow stale/retry times
    staleTime: 1000 * 60 * 10,
    retryDelay: 1000 * 60,
  });
  return data;
}

export function useActiveFiatProviders() {
  const config = useRemoteHiroConfig();
  if (!config?.activeFiatProviders) return {} as Record<string, ActiveFiatProviderType>;

  return Object.fromEntries(
    Object.entries(config.activeFiatProviders).filter(([_, provider]) => provider.enabled)
  );
}

export function useHasFiatProviders() {
  const activeProviders = useActiveFiatProviders();
  return (
    activeProviders &&
    Object.keys(activeProviders).reduce((acc, key) => activeProviders[key].enabled || acc, false)
  );
}

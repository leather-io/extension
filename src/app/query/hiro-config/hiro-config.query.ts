import { useQuery } from 'react-query';

import { GITHUB_ORG, GITHUB_REPO } from '@shared/constants';
import { BRANCH_NAME } from '@shared/environment';
import { isUndefined } from '@shared/utils';

export interface HiroMessage {
  title: string;
  text: string;
  purpose: 'error' | 'info' | 'warning';
  publishedAt: string;
  dismissible: boolean;
  chainTarget: 'all' | 'mainnet' | 'testnet';
  learnMoreUrl?: string;
  learnMoreText?: string;
}

export enum AvailableRegions {
  InsideUsa = 'inside-usa-only',
  OutsideUsa = 'outside-usa-only',
  Global = 'global',
}

export interface ActiveFiatProvider {
  availableRegions: AvailableRegions;
  enabled: boolean;
  hasFastCheckoutProcess: boolean;
  hasTradingFees: boolean;
  name: string;
}

interface FeeEstimationsConfig {
  maxValues?: number[];
  maxValuesEnabled?: boolean;
  minValues?: number[];
  minValuesEnabled?: boolean;
}

interface HiroConfig {
  messages: any;
  activeFiatProviders?: Record<string, ActiveFiatProvider>;
  feeEstimationsMinMax?: FeeEstimationsConfig;
}

const defaultBranch = 'main';
const githubWalletConfigRawUrl = `https://raw.githubusercontent.com/${GITHUB_ORG}/${GITHUB_REPO}/${
  BRANCH_NAME || defaultBranch
}/config/wallet-config.json`;

async function fetchHiroMessages(): Promise<HiroConfig> {
  return fetch(githubWalletConfigRawUrl).then(msg => msg.json());
}

function useRemoteHiroConfig() {
  const { data } = useQuery(['walletConfig'], fetchHiroMessages, {
    // As we're fetching from Github, a third-party, we want
    // to avoid any unnecessary stress on their services, so
    // we use quite slow stale/retry times
    staleTime: 1000 * 60 * 10,
    retryDelay: 1000 * 60,
  });
  return data;
}

export function useRemoteHiroMessages(): HiroMessage[] {
  const config = useRemoteHiroConfig();
  return config?.messages?.global ?? [];
}

export function useActiveFiatProviders() {
  const config = useRemoteHiroConfig();
  if (!config?.activeFiatProviders) return {} as Record<string, ActiveFiatProvider>;

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

export function useConfigFeeEstimationsMaxEnabled() {
  const config = useRemoteHiroConfig();
  if (isUndefined(config) || isUndefined(config?.feeEstimationsMinMax)) return;
  return config.feeEstimationsMinMax.maxValuesEnabled;
}

export function useConfigFeeEstimationsMaxValues() {
  const config = useRemoteHiroConfig();
  if (typeof config?.feeEstimationsMinMax === 'undefined') return;
  if (!config.feeEstimationsMinMax.maxValues) return;
  if (!Array.isArray(config.feeEstimationsMinMax.maxValues)) return;
  return config.feeEstimationsMinMax.maxValues;
}

export function useConfigFeeEstimationsMinEnabled() {
  const config = useRemoteHiroConfig();
  if (isUndefined(config) || isUndefined(config?.feeEstimationsMinMax)) return;
  return config.feeEstimationsMinMax.minValuesEnabled;
}

export function useConfigFeeEstimationsMinValues() {
  const config = useRemoteHiroConfig();
  if (typeof config?.feeEstimationsMinMax === 'undefined') return;
  if (!config.feeEstimationsMinMax.minValues) return;
  if (!Array.isArray(config.feeEstimationsMinMax.minValues)) return;
  return config.feeEstimationsMinMax.minValues;
}

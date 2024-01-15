import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import get from 'lodash.get';

import { GITHUB_ORG, GITHUB_REPO } from '@shared/constants';
import { BRANCH_NAME, IS_DEV_ENV, IS_TEST_ENV, WALLET_ENVIRONMENT } from '@shared/environment';
import { createMoney } from '@shared/models/money.model';
import { isUndefined } from '@shared/utils';

import { useWalletType } from '@app/common/use-wallet-type';
import { useHasCurrentBitcoinAccount } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';

import localConfig from '../../../../../config/wallet-config.json';

export interface HiroMessage {
  id: string;
  title: string;
  text: string;
  img?: string;
  imgWidth?: string;
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

interface RemoteConfig {
  messages: any;
  activeFiatProviders?: Record<string, ActiveFiatProvider>;
  bitcoinEnabled: boolean;
  bitcoinSendEnabled: boolean;
  feeEstimationsMinMax?: FeeEstimationsConfig;
  nftMetadataEnabled: boolean;
  ordinalsbot: {
    integrationEnabled: boolean;
    mainnetApiUrl: string;
    signetApiUrl: string;
  };
}

// TODO: BRANCH_NAME is not working here for config changes on PR branches
// Playwright tests fail with config changes not on main
const defaultBranch = IS_DEV_ENV || WALLET_ENVIRONMENT === 'testing' ? 'dev' : 'main';
const githubWalletConfigRawUrl = `https://raw.githubusercontent.com/${GITHUB_ORG}/${GITHUB_REPO}/${
  BRANCH_NAME || defaultBranch
}/config/wallet-config.json`;

async function fetchLeatherMessages(): Promise<RemoteConfig> {
  if ((!BRANCH_NAME && WALLET_ENVIRONMENT !== 'production') || IS_TEST_ENV)
    return localConfig as RemoteConfig;
  const resp = await axios.get(githubWalletConfigRawUrl);
  return resp.data;
}

function useRemoteConfig() {
  const { data } = useQuery(['walletConfig'], fetchLeatherMessages, {
    // As we're fetching from Github, a third-party, we want
    // to avoid any unnecessary stress on their services, so
    // we use quite slow stale/retry times
    staleTime: 1000 * 60 * 10,
    retryDelay: 1000 * 60,
  });
  return data;
}

export function useRemoteLeatherMessages(): HiroMessage[] {
  const config = useRemoteConfig();
  return get(config, 'messages.global', []);
}

export function useActiveFiatProviders() {
  const config = useRemoteConfig();
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

export function useConfigBitcoinEnabled() {
  const { whenWallet } = useWalletType();
  const config = useRemoteConfig();
  const hasBitcoinAccount = useHasCurrentBitcoinAccount();
  return whenWallet({
    ledger: (config?.bitcoinEnabled ?? true) && hasBitcoinAccount,
    software: config?.bitcoinEnabled ?? true,
  });
}

export function useConfigBitcoinSendEnabled() {
  const { whenWallet } = useWalletType();
  const config = useRemoteConfig();
  const hasBitcoinAccount = useHasCurrentBitcoinAccount();
  return whenWallet({
    ledger: config?.bitcoinSendEnabled && hasBitcoinAccount,
    software: config?.bitcoinSendEnabled ?? true,
  });
}

export function useRecoverUninscribedTaprootUtxosFeatureEnabled() {
  const config = useRemoteConfig();
  return get(config, 'recoverUninscribedTaprootUtxosFeatureEnabled', false);
}

export function useConfigFeeEstimationsMaxEnabled() {
  const config = useRemoteConfig();
  if (isUndefined(config) || isUndefined(config?.feeEstimationsMinMax)) return;
  return config.feeEstimationsMinMax.maxValuesEnabled;
}

export function useConfigFeeEstimationsMaxValues() {
  const config = useRemoteConfig();
  if (typeof config?.feeEstimationsMinMax === 'undefined') return;
  if (!config.feeEstimationsMinMax.maxValues) return;
  if (!Array.isArray(config.feeEstimationsMinMax.maxValues)) return;
  return config.feeEstimationsMinMax.maxValues.map(value => createMoney(value, 'STX'));
}

export function useConfigFeeEstimationsMinEnabled() {
  const config = useRemoteConfig();
  if (isUndefined(config) || isUndefined(config?.feeEstimationsMinMax)) return;
  return config.feeEstimationsMinMax.minValuesEnabled;
}

export function useConfigFeeEstimationsMinValues() {
  const config = useRemoteConfig();
  if (typeof config?.feeEstimationsMinMax === 'undefined') return;
  if (!config.feeEstimationsMinMax.minValues) return;
  if (!Array.isArray(config.feeEstimationsMinMax.minValues)) return;
  return config.feeEstimationsMinMax.minValues.map(value => createMoney(value, 'STX'));
}

export function useConfigNftMetadataEnabled() {
  const config = useRemoteConfig();
  return config?.nftMetadataEnabled ?? true;
}

export function useConfigOrdinalsbot() {
  const config = useRemoteConfig();
  return {
    integrationEnabled: get(config, 'ordinalsbot.integrationEnabled', true),
    mainnetApiUrl: get(config, 'ordinalsbot.mainnetApiUrl', 'https://api2.ordinalsbot.com'),
    signetApiUrl: get(config, 'ordinalsbot.signetApiUrl', 'https://signet.ordinalsbot.com'),
  };
}

import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import get from 'lodash.get';

import {
  ActiveFiatProvider,
  type DefaultMinMaxRangeFeeEstimations,
  HiroMessage,
  type RemoteConfig,
} from '@leather.io/query';
import { getPrincipalFromAssetString } from '@leather.io/stacks';
import { createMoney, isUndefined } from '@leather.io/utils';

import { useWalletType } from '@app/common/use-wallet-type';
import {
  type LeatherEnvironment,
  useLeatherEnv,
  useLeatherGithub,
} from '@app/query/leather-query-provider';
import { useHasCurrentBitcoinAccount } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

export { ActiveFiatProvider, AvailableRegions, HiroMessage } from '@leather.io/query';

function fetchLeatherMessages(env: string, leatherGh: LeatherEnvironment['github']) {
  const IS_DEV_ENV = env === 'development';
  const IS_TESTING_ENV = env === 'testing';
  // TODO: BRANCH_NAME is not working here for config changes on PR branches
  // Playwright tests fail with config changes not on main
  const defaultBranch = IS_DEV_ENV || IS_TESTING_ENV ? 'dev' : 'main';
  const githubWalletConfigRawUrl = `https://raw.githubusercontent.com/${leatherGh.org}/${leatherGh.repo}/${
    leatherGh.branchName || defaultBranch
  }/config/wallet-config.json`;

  return async function fetchLeatherMessagesImpl(): Promise<RemoteConfig> {
    if (leatherGh.localConfig && (IS_DEV_ENV || IS_TESTING_ENV)) {
      return leatherGh.localConfig;
    }
    const resp = await axios.get(githubWalletConfigRawUrl);
    return resp.data;
  };
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

// Update in mono repo
interface SbtcConfig {
  enabled: boolean;
  contracts: Record<'mainnet' | 'testnet', { address: string }>;
  emilyApiUrl: string;
  sponsorshipApiUrl: {
    mainnet: string;
    testnet: string;
  };
  swapsEnabled: boolean;
  sponsorshipsEnabled: boolean;
}

export function useConfigSbtc() {
  const config = useRemoteConfig();
  const network = useCurrentNetwork();
  const sbtc = config?.sbtc as SbtcConfig;

  return useMemo(() => {
    const contractIdMainnet = sbtc?.contracts.mainnet.address ?? '';
    const contractIdTestnet = sbtc?.contracts.testnet.address ?? '';
    const apiUrlMainnet = sbtc?.sponsorshipApiUrl.mainnet ?? '';
    const apiUrlTestnet = sbtc?.sponsorshipApiUrl.testnet ?? '';

    return {
      configLoading: !sbtc,
      isSbtcEnabled: sbtc?.enabled ?? false,
      isSbtcSponsorshipsEnabled: (sbtc?.enabled && sbtc?.sponsorshipsEnabled) ?? false,
      emilyApiUrl: sbtc?.emilyApiUrl ?? '',
      contractId: network.chain.bitcoin.mode === 'mainnet' ? contractIdMainnet : contractIdTestnet,
      sponsorshipApiUrl: network.chain.bitcoin.mode === 'mainnet' ? apiUrlMainnet : apiUrlTestnet,
      isSbtcContract(contract: string) {
        return (
          contract === getPrincipalFromAssetString(contractIdMainnet) ||
          contract === getPrincipalFromAssetString(contractIdTestnet)
        );
      },
    };
  }, [network.chain.bitcoin.mode, sbtc]);
}

function useRemoteConfig() {
  const env = useLeatherEnv();
  const leatherGh = useLeatherGithub();
  const { data } = useQuery({
    queryKey: ['walletConfig'],
    queryFn: fetchLeatherMessages(env, leatherGh),
    initialData: leatherGh.localConfig,
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
    integrationEnabled: config?.ordinalsbot?.integrationEnabled ?? true,
    mainnetApiUrl: config?.ordinalsbot?.mainnetApiUrl ?? 'https://api2.ordinalsbot.com',
    signetApiUrl: config?.ordinalsbot?.signetApiUrl ?? 'https://signet.ordinalsbot.com',
  };
}

export function useConfigRunesEnabled() {
  const config = useRemoteConfig();
  return get(config, 'runesEnabled', false);
}

export function useConfigSwapsEnabled() {
  const config = useRemoteConfig();
  return get(config, 'swapsEnabled', false);
}

export function useConfigTokensEnabledByDefault(): string[] {
  const config = useRemoteConfig();
  return get(config, 'tokensEnabledByDefault', []);
}

export function useConfigTokenTransferFeeEstimations() {
  const config = useRemoteConfig();
  return get(config, 'tokenTransferFeeEstimations', []);
}

export function useConfigSpamFilterWhitelist(): string[] {
  const config = useRemoteConfig();
  return get(config, 'spamFilterWhitelist', []);
}

export function useConfigStacksContractCallFeeEstimations():
  | DefaultMinMaxRangeFeeEstimations
  | undefined {
  const config = useRemoteConfig();
  return get(config, 'stacksContractCallFeeEstimations', undefined);
}

export function useConfigStacksContractDeploymentFeeEstimations():
  | DefaultMinMaxRangeFeeEstimations
  | undefined {
  const config = useRemoteConfig();
  return get(config, 'stacksContractDeploymentFeeEstimations', undefined);
}

export function useConfigPromoCardEnabled() {
  const config = useRemoteConfig();
  return get(config, 'promoCardEnabled', false);
}

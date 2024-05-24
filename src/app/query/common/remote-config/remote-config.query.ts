import { useRemoteConfig } from '@leather-wallet/query';

import { useWalletType } from '@app/common/use-wallet-type';
import { useHasCurrentBitcoinAccount } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';

export {
  HiroMessage,
  AvailableRegions,
  ActiveFiatProvider,
  useRemoteLeatherMessages,
  useActiveFiatProviders,
  useHasFiatProviders,
  useRecoverUninscribedTaprootUtxosFeatureEnabled,
  useConfigFeeEstimationsMaxEnabled,
  useConfigFeeEstimationsMaxValues,
  useConfigFeeEstimationsMinEnabled,
  useConfigFeeEstimationsMinValues,
  useConfigNftMetadataEnabled,
  useConfigRunesEnabled,
  useConfigSwapEnabled,
} from '@leather-wallet/query';

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

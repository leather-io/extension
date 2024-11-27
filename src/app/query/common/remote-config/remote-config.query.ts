import { useMemo } from 'react';

import { useRemoteConfig } from '@leather.io/query';
import { getPrincipalFromContractId } from '@leather.io/utils';

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
  useConfigNftMetadataEnabled,
  useConfigRunesEnabled,
  useConfigSwapsEnabled,
} from '@leather.io/query';

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

export function useConfigSbtc() {
  const config = useRemoteConfig();
  // TODO: Update with new mono version
  const sbtc = config?.sbtc;
  return useMemo(
    () => ({
      isSbtcContract(contract: string) {
        return (
          contract === getPrincipalFromContractId(sbtc?.contracts.mainnet.address ?? '') ||
          contract === getPrincipalFromContractId(sbtc?.contracts.testnet.address ?? '')
        );
      },
    }),
    [sbtc]
  );
}

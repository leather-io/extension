import { useMemo } from 'react';

import type { HDKey } from '@scure/bip32';
import type { P2Ret } from '@scure/btc-signer/payment';

import {
  type SupportedPaymentType,
  deriveAddressIndexZeroFromAccount,
  getNativeSegwitPaymentFromAddressIndex,
  getTaprootPaymentFromAddressIndex,
} from '@leather.io/bitcoin';
import type { BitcoinNetworkModes } from '@leather.io/models';
import { createNullArrayOfLength, isDefined } from '@leather.io/utils';

import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useGenerateNativeSegwitAccount } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useGenerateTaprootAccount } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useCurrentNetworkId } from '@app/store/networks/networks.selectors';
import type { MonitoredAddress } from '@background/monitors/address-monitor';

const paymentFnMap: Record<
  SupportedPaymentType,
  (keychain: HDKey, network: BitcoinNetworkModes) => P2Ret
> = {
  p2tr: getTaprootPaymentFromAddressIndex,
  p2wpkh: getNativeSegwitPaymentFromAddressIndex,
};

export function useMonitorableAddresses() {
  const currentAccountIndex = useCurrentAccountIndex();
  const currentNetworkId = useCurrentNetworkId();
  const createNativeSegwitAccount = useGenerateNativeSegwitAccount();
  const createTaprootAccount = useGenerateTaprootAccount();

  const stacksAccounts = useStacksAccounts();

  return useMemo(() => {
    if (!stacksAccounts || !currentNetworkId) return;

    const stacksAddresses = stacksAccounts.map(
      account =>
        ({
          accountIndex: account.index,
          address: account.address,
          chain: 'stacks',
          isCurrent: account.index === currentAccountIndex,
        }) satisfies MonitoredAddress
    );
    const btcAddresses = createNullArrayOfLength(stacksAccounts.length).flatMap((_, index) =>
      [createNativeSegwitAccount(index), createTaprootAccount(index)]
        .filter(isDefined)
        .map(account => {
          const addressIndexKeychain = deriveAddressIndexZeroFromAccount(account.keychain);
          if (account.type !== 'p2tr' && account.type !== 'p2wpkh') return undefined;
          const payment = paymentFnMap[account.type](addressIndexKeychain, 'mainnet');
          if (!payment.address) return undefined;
          return {
            accountIndex: index,
            address: payment.address,
            chain: 'bitcoin',
            isCurrent: index === currentAccountIndex,
          } satisfies MonitoredAddress;
        })
        .filter(isDefined)
    );
    // if one address array is empty and the other not, we're in an intermediate state
    return (stacksAddresses.length === 0 && btcAddresses.length > 0) ||
      (btcAddresses.length === 0 && stacksAddresses.length > 0)
      ? undefined
      : [...stacksAddresses, ...btcAddresses];
  }, [
    createNativeSegwitAccount,
    createTaprootAccount,
    stacksAccounts,
    currentNetworkId,
    currentAccountIndex,
  ]);
}

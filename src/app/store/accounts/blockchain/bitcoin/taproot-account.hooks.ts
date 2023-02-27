import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { deriveTaprootReceiveAddressIndex } from '@shared/crypto/bitcoin/p2tr-address-gen';
import { isUndefined } from '@shared/utils';

import { whenNetwork } from '@app/common/utils';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useCurrentAccountIndex } from '../../account';
import { formatBitcoinAccount, tempHardwareAccountForTesting } from './bitcoin-account.models';
import { selectMainnetTaprootKeychain, selectTestnetTaprootKeychain } from './bitcoin-keychain';

function useTaprootKeychainByAccount() {
  const network = useCurrentNetwork();
  return useSelector(
    whenNetwork(network.chain.bitcoin.network)({
      mainnet: selectMainnetTaprootKeychain,
      testnet: selectTestnetTaprootKeychain,
    })
  );
}

function useBitcoinTaprootAccount(index: number) {
  const keychain = useTaprootKeychainByAccount();
  return useMemo(() => {
    // TODO: Remove with bitcoin Ledger integration
    if (isUndefined(keychain)) return tempHardwareAccountForTesting;
    return formatBitcoinAccount(keychain(index))(index);
  }, [keychain, index]);
}

function useCurrentBitcoinTaprootAccount() {
  const currentAccountIndex = useCurrentAccountIndex();
  return useBitcoinTaprootAccount(currentAccountIndex);
}

function useDeriveTaprootAccountIndexAddressIndexZero(xpub: string) {
  const network = useCurrentNetwork();
  return useMemo(
    () =>
      deriveTaprootReceiveAddressIndex({
        xpub,
        index: 0,
        network: network.chain.bitcoin.network,
      }),
    [xpub, network]
  );
}

export function useCurrentTaprootAccountKeychain() {
  const currentAccountIndex = useCurrentAccountIndex();
  const accountKeychain = useTaprootKeychainByAccount();
  if (!accountKeychain) throw new Error();
  return accountKeychain(currentAccountIndex);
}

// ts-unused-exports:disable-next-line
export function useCurrentTaprootAccountAddressIndexZero() {
  const { xpub } = useCurrentBitcoinTaprootAccount();
  return useDeriveTaprootAccountIndexAddressIndexZero(xpub)?.address as string;
}
// ts-unused-exports:disable-next-line
export function useTaprootAccountIndexAddressIndexZero(accountIndex: number) {
  const { xpub } = useBitcoinTaprootAccount(accountIndex);
  return useDeriveTaprootAccountIndexAddressIndexZero(xpub)?.address as string;
}

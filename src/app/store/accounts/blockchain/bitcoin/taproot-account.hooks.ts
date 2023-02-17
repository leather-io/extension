import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { deriveTaprootReceiveAddressIndex } from '@shared/crypto/bitcoin/p2tr-address-gen';
import { isUndefined } from '@shared/utils';

import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useCurrentAccountIndex } from '../../account';
import { formatBitcoinAccount, tempHardwareAccountForTesting } from './bitcoin-account.models';
import { selectSoftwareBitcoinTaprootKeychain } from './bitcoin-keychain';

function useBitcoinTaprootAccount(index: number) {
  const keychain = useSelector(selectSoftwareBitcoinTaprootKeychain);
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

export function useKeychain() {
  return useSelector(selectSoftwareBitcoinTaprootKeychain);
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

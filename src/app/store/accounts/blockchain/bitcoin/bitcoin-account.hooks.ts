import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { HDKey } from '@scure/bip32';

import { deriveNativeSegWitReceiveAddressIndexFromXpub } from '@shared/crypto/bitcoin/p2wpkh-address-gen';

import { SoftwareBitcoinAccount } from '@app/store/accounts/blockchain/bitcoin/bitcoin-account.models';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useCurrentAccountIndex } from '../../account';
import { selectSoftwareBitcoinNativeSegWitKeychain } from './bitcoin-keychain';

const firstAccountIndex = 0;

function deriveNativeSegWitAccount(keychain: HDKey) {
  return (index: number): SoftwareBitcoinAccount => ({
    type: 'software',
    index,
    xpub: keychain.publicExtendedKey,
  });
}

function useBitcoinAccountAtIndex(index: number) {
  const keychain = useSelector(selectSoftwareBitcoinNativeSegWitKeychain);
  return useMemo(() => deriveNativeSegWitAccount(keychain(index))(index), [keychain, index]);
}

function useCurrentBtcAccount() {
  const currentAccountIndex = useCurrentAccountIndex();
  return useBitcoinAccountAtIndex(currentAccountIndex);
}

function useDeriveNativeSegWitAccountIndexAddressIndexZero(xpub: string) {
  const network = useCurrentNetwork();
  return useMemo(
    () =>
      deriveNativeSegWitReceiveAddressIndexFromXpub({
        xpub,
        index: firstAccountIndex,
        network: network.chain.bitcoin.network,
      }),
    [xpub, network]
  );
}

export function useCurrentBtcAccountAddressIndexZero() {
  const { xpub } = useCurrentBtcAccount();
  return useDeriveNativeSegWitAccountIndexAddressIndexZero(xpub);
}

export function useBtcAccountIndexAddressIndexZero(accountIndex: number) {
  const { xpub } = useBitcoinAccountAtIndex(accountIndex);
  return useDeriveNativeSegWitAccountIndexAddressIndexZero(xpub);
}

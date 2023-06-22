import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { bitcoinNetworkModeToCoreNetworkMode } from '@shared/crypto/bitcoin/bitcoin.utils';
import { getNativeSegWitPaymentFromAddressIndex } from '@shared/crypto/bitcoin/p2wpkh-address-gen';

import { whenNetwork } from '@app/common/utils';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useCurrentAccountIndex } from '../../account';
import {
  bitcoinSignerFactory,
  selectMainnetNativeSegWitKeychain,
  selectTestnetNativeSegWitKeychain,
  useMakeBitcoinNetworkSignersForPaymentType,
} from './bitcoin-keychain';

export function useNativeSegwitActiveNetworkAccountPrivateKeychain() {
  const network = useCurrentNetwork();
  const selector = useMemo(
    () =>
      whenNetwork(bitcoinNetworkModeToCoreNetworkMode(network.chain.bitcoin.network))({
        mainnet: selectMainnetNativeSegWitKeychain,
        testnet: selectTestnetNativeSegWitKeychain,
      }),
    [network.chain.bitcoin.network]
  );
  return useSelector(selector);
}

export function useNativeSegwitCurrentAccountPrivateKeychain() {
  const keychain = useNativeSegwitActiveNetworkAccountPrivateKeychain();
  const currentAccountIndex = useCurrentAccountIndex();
  return useMemo(() => keychain?.(currentAccountIndex), [currentAccountIndex, keychain]);
}

export function useNativeSegwitNetworkSigners() {
  const mainnetKeychainFn = useSelector(selectMainnetNativeSegWitKeychain);
  const testnetKeychainFn = useSelector(selectTestnetNativeSegWitKeychain);

  return useMakeBitcoinNetworkSignersForPaymentType(
    mainnetKeychainFn,
    testnetKeychainFn,
    getNativeSegWitPaymentFromAddressIndex
  );
}

function useNativeSegwitSigner(accountIndex: number) {
  const network = useCurrentNetwork();
  const accountKeychain = useNativeSegwitActiveNetworkAccountPrivateKeychain()?.(accountIndex);

  return useMemo(() => {
    if (!accountKeychain) return;
    return bitcoinSignerFactory({
      accountIndex,
      accountKeychain,
      paymentFn: getNativeSegWitPaymentFromAddressIndex,
      network: network.chain.bitcoin.network,
    });
  }, [accountIndex, accountKeychain, network.chain.bitcoin.network]);
}

export function useCurrentAccountNativeSegwitSigner() {
  const currentAccountIndex = useCurrentAccountIndex();
  return useNativeSegwitSigner(currentAccountIndex);
}

export function useCurrentAccountNativeSegwitIndexZeroSigner() {
  const signer = useCurrentAccountNativeSegwitSigner();
  return useMemo(() => {
    if (!signer) throw new Error('No signer');
    return signer(0);
  }, [signer]);
}

/**
 * @deprecated Use signer.address instead
 */
export function useCurrentAccountNativeSegwitAddressIndexZero() {
  const signer = useCurrentAccountNativeSegwitSigner();
  return useMemo(() => signer?.(0).payment.address, [signer]) as string;
}

/**
 * @deprecated Use signer.address instead
 */
export function useNativeSegwitAccountIndexAddressIndexZero(accountIndex: number) {
  const signer = useNativeSegwitSigner(accountIndex)?.(0);
  return signer?.payment.address as string;
}

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

function useNativeSegwitActiveNetworkAccountPrivateKeychain() {
  const network = useCurrentNetwork();
  return useSelector(
    whenNetwork(bitcoinNetworkModeToCoreNetworkMode(network.chain.bitcoin.network))({
      mainnet: selectMainnetNativeSegWitKeychain,
      testnet: selectTestnetNativeSegWitKeychain,
    })
  );
}

export function useNativeSegwitCurrentAccountPrivateKeychain() {
  const keychain = useNativeSegwitActiveNetworkAccountPrivateKeychain();
  const currentAccountIndex = useCurrentAccountIndex();
  return keychain?.(currentAccountIndex);
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

function useCurrentAccountNativeSegwitSignerIndexZero() {
  return useCurrentAccountNativeSegwitSigner()?.(0);
}

function useNativeSegwitSigner(accountIndex: number) {
  const network = useCurrentNetwork();
  const accountKeychain = useNativeSegwitActiveNetworkAccountPrivateKeychain()?.(accountIndex);
  if (!accountKeychain) return;

  return bitcoinSignerFactory({
    accountKeychain,
    paymentFn: getNativeSegWitPaymentFromAddressIndex,
    network: network.chain.bitcoin.network,
  });
}
export function useCurrentAccountNativeSegwitSigner() {
  const currentAccountIndex = useCurrentAccountIndex();
  return useNativeSegwitSigner(currentAccountIndex);
}

export function useCurrentAccountNativeSegwitAddressIndexZero() {
  const signer = useCurrentAccountNativeSegwitSignerIndexZero();
  return signer?.payment.address as string;
}

export function useNativeSegwitAccountIndexAddressIndexZero(accountIndex: number) {
  const signer = useNativeSegwitSigner(accountIndex)?.(0);
  return signer?.payment.address as string;
}

export function useCurrentBitcoinNativeSegwitAddressIndexPublicKeychain() {
  const signer = useCurrentAccountNativeSegwitSignerIndexZero();
  return signer?.publicKeychain;
}

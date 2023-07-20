import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { createSelector } from '@reduxjs/toolkit';

import {
  bitcoinNetworkModeToCoreNetworkMode,
  deriveAddressIndexZeroFromAccount,
} from '@shared/crypto/bitcoin/bitcoin.utils';
import {
  deriveNativeSegwitAccount,
  getNativeSegWitPaymentFromAddressIndex,
} from '@shared/crypto/bitcoin/p2wpkh-address-gen';

import { mnemonicToRootNode } from '@app/common/keychain/keychain';
import { whenNetwork } from '@app/common/utils';
import { RootState } from '@app/store';
import { selectCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useCurrentAccountIndex } from '../../account';
import { bitcoinKeychainSelectorFactory } from './bitcoin-keychain';
import { bitcoinSignerFactory, useMakeBitcoinNetworkSignersForPaymentType } from './bitcoin-signer';

export function getNativeSegwitMainnetAddressFromMnemonic(secretKey: string) {
  return (accountIndex: number) => {
    const rootNode = mnemonicToRootNode(secretKey);
    const account = deriveNativeSegwitAccount(rootNode, 'mainnet')(accountIndex);
    return getNativeSegWitPaymentFromAddressIndex(
      deriveAddressIndexZeroFromAccount(account.keychain),
      'mainnet'
    );
  };
}

const selectMainnetNativeSegwitAccount = bitcoinKeychainSelectorFactory(
  deriveNativeSegwitAccount,
  'mainnet'
);

const selectTestnetNativeSegwitAccount = bitcoinKeychainSelectorFactory(
  deriveNativeSegwitAccount,
  'testnet'
);

const selectNativeSegwitActiveNetworkAccountPrivateKeychain = createSelector(
  (state: RootState) => state,
  selectCurrentNetwork,
  (rootState, network) =>
    whenNetwork(bitcoinNetworkModeToCoreNetworkMode(network.chain.bitcoin.network))({
      mainnet: selectMainnetNativeSegwitAccount(rootState),
      testnet: selectTestnetNativeSegwitAccount(rootState),
    })
);

export function useNativeSegwitActiveNetworkAccountPrivateKeychain() {
  return useSelector(selectNativeSegwitActiveNetworkAccountPrivateKeychain);
}

export function useNativeSegwitCurrentAccountPrivateKeychain() {
  const keychain = useNativeSegwitActiveNetworkAccountPrivateKeychain();
  const currentAccountIndex = useCurrentAccountIndex();
  return useMemo(() => keychain?.(currentAccountIndex), [currentAccountIndex, keychain]);
}

export function useNativeSegwitNetworkSigners() {
  const mainnetKeychainFn = useSelector(selectMainnetNativeSegwitAccount);
  const testnetKeychainFn = useSelector(selectTestnetNativeSegwitAccount);

  return useMakeBitcoinNetworkSignersForPaymentType(
    mainnetKeychainFn,
    testnetKeychainFn,
    getNativeSegWitPaymentFromAddressIndex
  );
}

function useNativeSegwitSigner(accountIndex: number) {
  const account = useNativeSegwitActiveNetworkAccountPrivateKeychain()?.(accountIndex);

  return useMemo(() => {
    if (!account) return;
    return bitcoinSignerFactory({
      accountIndex,
      accountKeychain: account.keychain,
      paymentFn: getNativeSegWitPaymentFromAddressIndex,
      network: account.network,
    });
  }, [accountIndex, account]);
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

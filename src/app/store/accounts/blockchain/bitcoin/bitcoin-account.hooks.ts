import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { HDKey } from '@scure/bip32';
import * as btc from 'micro-btc-signer';

import {
  deriveBip32KeychainFromExtendedPublicKey,
  deriveNativeSegWitReceiveAddressIndexAddress,
} from '@shared/crypto/bitcoin/p2wpkh-address-gen';

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
      deriveNativeSegWitReceiveAddressIndexAddress({
        xpub,
        index: firstAccountIndex,
        network: network.chain.bitcoin.network,
      }),
    [xpub, network]
  );
}

export function useCurrentBtcAccountAddressIndexZero() {
  const { xpub } = useCurrentBtcAccount();
  return useDeriveNativeSegWitAccountIndexAddressIndexZero(xpub) as string;
}

export function useBtcAccountIndexAddressIndexZero(accountIndex: number) {
  const { xpub } = useBitcoinAccountAtIndex(accountIndex);
  return useDeriveNativeSegWitAccountIndexAddressIndexZero(xpub) as string;
}

function useCurrentBitcoinAccountKeychain() {
  const { xpub } = useCurrentBtcAccount();
  const keychain = deriveBip32KeychainFromExtendedPublicKey(xpub);
  if (!keychain.publicKey) throw new Error('No public key for given keychain');
  if (!keychain.pubKeyHash) throw new Error('No pub key hash for given keychain');
  return keychain;
}

// Concept of current address index won't exist with privacy mode
export function useCurrentBitcoinAddressIndexKeychain() {
  const keychain = useCurrentBitcoinAccountKeychain();
  return keychain.deriveChild(0).deriveChild(0);
}

export function useSignBitcoinTx() {
  const index = useCurrentAccountIndex();
  const keychain = useSelector(selectSoftwareBitcoinNativeSegWitKeychain)(index);
  return useCallback(
    (tx: btc.Transaction) => tx.sign(keychain.deriveChild(0).deriveChild(0).privateKey!),
    [keychain]
  );
}

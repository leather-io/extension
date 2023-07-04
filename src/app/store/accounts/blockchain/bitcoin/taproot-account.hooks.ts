import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { createSelector } from '@reduxjs/toolkit';

import { BitcoinNetworkModes } from '@shared/constants';
import { bitcoinNetworkModeToCoreNetworkMode } from '@shared/crypto/bitcoin/bitcoin.utils';
import {
  deriveTaprootAccount,
  getTaprootPaymentFromAddressIndex,
} from '@shared/crypto/bitcoin/p2tr-address-gen';

import { whenNetwork } from '@app/common/utils';
import { RootState } from '@app/store';
import { selectCurrentAccountIndex } from '@app/store/keys/key.selectors';
import { selectCurrentNetwork, useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useCurrentAccountIndex } from '../../account';
import { bitcoinKeychainSelectorFactory } from './bitcoin-keychain';
import { bitcoinSignerFactory, useMakeBitcoinNetworkSignersForPaymentType } from './bitcoin-signer';

const selectMainnetTaprootAccount = bitcoinKeychainSelectorFactory(deriveTaprootAccount, 'mainnet');

const selectTestnetTaprootAccount = bitcoinKeychainSelectorFactory(deriveTaprootAccount, 'testnet');

const selectTaprootActiveNetworkAccountPrivateKeychain = createSelector(
  (state: RootState) => state,
  selectCurrentNetwork,
  (rootState, network) =>
    whenNetwork(bitcoinNetworkModeToCoreNetworkMode(network.chain.bitcoin.network))({
      mainnet: selectMainnetTaprootAccount(rootState),
      testnet: selectTestnetTaprootAccount(rootState),
    })
);

const selectCurrentTaprootAccountKeychain = createSelector(
  selectTaprootActiveNetworkAccountPrivateKeychain,
  selectCurrentAccountIndex,
  (taprootKeychain, accountIndex) => taprootKeychain?.(accountIndex)
);

export function useTaprootAccountKeychain(accountIndex: number) {
  const taprootKeychain = useSelector(selectTaprootActiveNetworkAccountPrivateKeychain);
  return useMemo(() => taprootKeychain?.(accountIndex), [taprootKeychain, accountIndex]);
}

export function useTaprootCurrentPrivateAccount() {
  return useSelector(selectCurrentTaprootAccountKeychain);
}

export function useTaprootNetworkSigners() {
  const mainnetKeychainFn = useSelector(selectMainnetTaprootAccount);
  const testnetKeychainFn = useSelector(selectTestnetTaprootAccount);

  return useMakeBitcoinNetworkSignersForPaymentType(
    mainnetKeychainFn,
    testnetKeychainFn,
    getTaprootPaymentFromAddressIndex
  );
}

function useTaprootSigner(accountIndex: number, network: BitcoinNetworkModes) {
  const account = useTaprootAccountKeychain(accountIndex);

  return useMemo(() => {
    if (!account) return; // TODO: Revisit this return early
    return bitcoinSignerFactory({
      accountIndex,
      accountKeychain: account.keychain,
      paymentFn: getTaprootPaymentFromAddressIndex,
      network,
    });
  }, [account, accountIndex, network]);
}

export function useCurrentAccountTaprootIndexZeroSigner() {
  const signer = useCurrentAccountTaprootSigner();
  return useMemo(() => {
    if (!signer) throw new Error('No signer');
    return signer(0);
  }, [signer]);
}

export function useCurrentAccountTaprootSigner() {
  const currentAccountIndex = useCurrentAccountIndex();
  const network = useCurrentNetwork();
  return useTaprootSigner(currentAccountIndex, network.chain.bitcoin.network);
}

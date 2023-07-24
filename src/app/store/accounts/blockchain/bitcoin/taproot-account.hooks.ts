import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { createSelector } from '@reduxjs/toolkit';

import { BitcoinNetworkModes } from '@shared/constants';
import {
  bitcoinNetworkModeToCoreNetworkMode,
  lookUpLedgerKeysByPath,
} from '@shared/crypto/bitcoin/bitcoin.utils';
import {
  deriveTaprootAccount,
  getTaprootAccountDerivationPath,
  getTaprootPaymentFromAddressIndex,
} from '@shared/crypto/bitcoin/p2tr-address-gen';

import { selectCurrentAccountIndex } from '@app/store/keys/key.selectors';
import { selectCurrentNetwork, useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useCurrentAccountIndex } from '../../account';
import {
  bitcoinAccountBuilderFactory,
  useBitcoinExtendedPublicKeyVersions,
} from './bitcoin-keychain';
import {
  bitcoinAddressIndexSignerFactory,
  useMakeBitcoinNetworkSignersForPaymentType,
} from './bitcoin-signer';

const selectTaprootAccountBuilder = bitcoinAccountBuilderFactory(
  deriveTaprootAccount,
  lookUpLedgerKeysByPath(getTaprootAccountDerivationPath)
);

const selectCurrentNetworkTaprootAccountBuilder = createSelector(
  selectTaprootAccountBuilder,
  selectCurrentNetwork,
  (taprootKeychain, network) =>
    taprootKeychain[bitcoinNetworkModeToCoreNetworkMode(network.chain.bitcoin.network)]
);
const selectCurrentTaprootAccount = createSelector(
  selectCurrentNetworkTaprootAccountBuilder,
  selectCurrentAccountIndex,
  (taprootKeychain, accountIndex) => taprootKeychain(accountIndex)
);

export function useTaprootAccount(accountIndex: number) {
  const generateTaprootAccount = useSelector(selectCurrentNetworkTaprootAccountBuilder);
  return useMemo(
    () => generateTaprootAccount(accountIndex),
    [generateTaprootAccount, accountIndex]
  );
}

export function useCurrentTaprootAccount() {
  return useSelector(selectCurrentTaprootAccount);
}

export function useTaprootNetworkSigners() {
  const { mainnet: mainnetKeychain, testnet: testnetKeychain } = useSelector(
    selectTaprootAccountBuilder
  );
  return useMakeBitcoinNetworkSignersForPaymentType(
    mainnetKeychain,
    testnetKeychain,
    getTaprootPaymentFromAddressIndex
  );
}

function useTaprootSigner(accountIndex: number, network: BitcoinNetworkModes) {
  const account = useTaprootAccount(accountIndex);
  const extendedPublicKeyVersions = useBitcoinExtendedPublicKeyVersions();

  return useMemo(() => {
    if (!account) return; // TODO: Revisit this return early
    return bitcoinAddressIndexSignerFactory({
      accountIndex,
      accountKeychain: account.keychain,
      paymentFn: getTaprootPaymentFromAddressIndex,
      network,
      extendedPublicKeyVersions,
    });
  }, [account, accountIndex, extendedPublicKeyVersions, network]);
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

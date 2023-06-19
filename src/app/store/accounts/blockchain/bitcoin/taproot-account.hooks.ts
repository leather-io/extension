import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { BitcoinNetworkModes } from '@shared/constants';
import { bitcoinNetworkModeToCoreNetworkMode } from '@shared/crypto/bitcoin/bitcoin.utils';
import { getTaprootPaymentFromAddressIndex } from '@shared/crypto/bitcoin/p2tr-address-gen';

import { whenNetwork } from '@app/common/utils';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useCurrentAccountIndex } from '../../account';
import {
  bitcoinSignerFactory,
  selectMainnetTaprootKeychain,
  selectTestnetTaprootKeychain,
  useMakeBitcoinNetworkSignersForPaymentType,
} from './bitcoin-keychain';

function useTaprootActiveNetworkAccountPrivateKeychain() {
  const network = useCurrentNetwork();
  return useSelector(
    whenNetwork(bitcoinNetworkModeToCoreNetworkMode(network.chain.bitcoin.network))({
      mainnet: selectMainnetTaprootKeychain,
      testnet: selectTestnetTaprootKeychain,
    })
  );
}

export function useTaprootCurrentAccountPrivateKeychain() {
  const currentAccountIndex = useCurrentAccountIndex();
  return useTaprootAccountKeychain(currentAccountIndex);
}

export function useTaprootAccountKeychain(accountIndex: number) {
  const accountKeychain = useTaprootActiveNetworkAccountPrivateKeychain();
  return useMemo(() => {
    if (!accountKeychain) return; // TODO: Revisit this return early
    return accountKeychain(accountIndex);
  }, [accountIndex, accountKeychain]);
}

export function useTaprootNetworkSigners() {
  const mainnetKeychainFn = useSelector(selectMainnetTaprootKeychain);
  const testnetKeychainFn = useSelector(selectTestnetTaprootKeychain);

  return useMakeBitcoinNetworkSignersForPaymentType(
    mainnetKeychainFn,
    testnetKeychainFn,
    getTaprootPaymentFromAddressIndex
  );
}

function useTaprootSigner(accountIndex: number, network: BitcoinNetworkModes) {
  const accountKeychain = useTaprootAccountKeychain(accountIndex);

  return useMemo(() => {
    if (!accountKeychain) return; // TODO: Revisit this return early
    return bitcoinSignerFactory({
      accountIndex,
      accountKeychain,
      paymentFn: getTaprootPaymentFromAddressIndex,
      network,
    });
  }, [accountIndex, accountKeychain, network]);
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

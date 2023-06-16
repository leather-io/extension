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
  if (!accountKeychain) return; // TODO: Revisit this return early
  return accountKeychain(accountIndex);
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
  if (!accountKeychain) return; // TODO: Revisit this return early

  return bitcoinSignerFactory({
    accountKeychain,
    paymentFn: getTaprootPaymentFromAddressIndex,
    network,
  });
}

export function useCurrentAccountTaprootSigner() {
  const currentAccountIndex = useCurrentAccountIndex();
  const network = useCurrentNetwork();
  return useTaprootSigner(currentAccountIndex, network.chain.bitcoin.network);
}

export function useCurrentAccountTaprootAddressIndexZeroPayment() {
  const createSigner = useCurrentAccountTaprootSigner();
  const indexZeroSigner = createSigner?.(0);
  if (!indexZeroSigner?.payment.address) throw new Error('No address found');
  const publicKey = indexZeroSigner.publicKeychain.publicKey;
  if (!publicKey) throw new Error('No public key found');
  // Creating new object to have known property types
  return {
    address: indexZeroSigner.payment.address,
    publicKey,
    type: indexZeroSigner.payment.type,
  };
}

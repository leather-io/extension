import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import * as btc from '@scure/btc-signer';

import {
  deriveAddressIndexKeychainFromAccount,
  deriveAddressIndexZeroFromAccount,
} from '@shared/crypto/bitcoin/bitcoin.utils';
import {
  deriveTaprootReceiveAddressIndex,
  getTaprootPaymentFromAddressIndex,
} from '@shared/crypto/bitcoin/p2tr-address-gen';
import { isUndefined } from '@shared/utils';

import { bitcoinNetworkModeToCoreNetworkMode, whenNetwork } from '@app/common/utils';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useCurrentAccountIndex } from '../../account';
import { formatBitcoinAccount, tempHardwareAccountForTesting } from './bitcoin-account.models';
import { selectMainnetTaprootKeychain, selectTestnetTaprootKeychain } from './bitcoin-keychain';

function useTaprootCurrentNetworkAccountPrivateKeychain() {
  const network = useCurrentNetwork();
  return useSelector(
    whenNetwork(bitcoinNetworkModeToCoreNetworkMode(network.chain.bitcoin.network))({
      mainnet: selectMainnetTaprootKeychain,
      testnet: selectTestnetTaprootKeychain,
    })
  );
}

export function useCurrentTaprootAccountKeychain() {
  const currentAccountIndex = useCurrentAccountIndex();
  return useTaprootAccountKeychain(currentAccountIndex);
}

export function useTaprootAccountKeychain(accountIndex: number) {
  const accountKeychain = useTaprootCurrentNetworkAccountPrivateKeychain();
  if (!accountKeychain) return; // TODO: Revisit this return early
  return accountKeychain(accountIndex);
}

// Concept of current address index won't exist with privacy mode
export function useCurrentTaprootAddressIndexKeychain() {
  const keychain = useCurrentTaprootAccountKeychain();
  if (!keychain) return; // TODO: Revisit this return early
  return deriveAddressIndexZeroFromAccount(keychain);
}

function useBitcoinTaprootAccountInfo(index: number) {
  const keychain = useTaprootCurrentNetworkAccountPrivateKeychain();
  return useMemo(() => {
    // TODO: Remove with bitcoin Ledger integration
    if (isUndefined(keychain)) return tempHardwareAccountForTesting;
    return formatBitcoinAccount(keychain(index))(index);
  }, [keychain, index]);
}

function useCurrentBitcoinTaprootAccountInfo() {
  const currentAccountIndex = useCurrentAccountIndex();
  return useBitcoinTaprootAccountInfo(currentAccountIndex);
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

export function useCurrentBtcTaprootAccountAddressIndexZeroPayment() {
  const { xpub } = useCurrentBitcoinTaprootAccountInfo();
  const payment = useDeriveTaprootAccountIndexAddressIndexZero(xpub);
  if (!payment?.address) throw new Error('No address found');
  // Creating new object to have known property types
  return { address: payment.address, type: payment.type };
}

export function useSignBitcoinTaprootTx() {
  const index = useCurrentAccountIndex();
  const keychain = useTaprootCurrentNetworkAccountPrivateKeychain()?.(index);

  return useCallback(
    (tx: btc.Transaction) => {
      if (isUndefined(keychain)) return;
      tx.sign(deriveAddressIndexZeroFromAccount(keychain).privateKey!);
    },
    [keychain]
  );
}

interface UseSignBitcoinTaprootInputAtIndexArgs {
  allowedSighash?: btc.SignatureHash[];
  idx: number;
  tx: btc.Transaction;
}
export function useSignBitcoinTaprootInputAtIndex() {
  const index = useCurrentAccountIndex();
  const keychain = useTaprootCurrentNetworkAccountPrivateKeychain()?.(index);

  return useCallback(
    ({ allowedSighash, idx, tx }: UseSignBitcoinTaprootInputAtIndexArgs) => {
      if (isUndefined(keychain)) return;
      tx.signIdx(deriveAddressIndexZeroFromAccount(keychain).privateKey!, idx, allowedSighash);
    },
    [keychain]
  );
}

// TODO: Address index 0 is hardcoded here bc this is only used to pass the first
// taproot address to the app thru the auth response. This is only temporary, it
// should be removed once the request address api is in place.
export function useAllBitcoinTaprootNetworksByAccount() {
  const mainnetKeychainAtAccount = useSelector(selectMainnetTaprootKeychain);
  const testnetKeychainAtAccount = useSelector(selectTestnetTaprootKeychain);

  return useCallback(
    (accountIndex: number) => {
      if (!mainnetKeychainAtAccount || !testnetKeychainAtAccount)
        throw new Error('Cannot derive addresses in non-software mode');

      return {
        mainnet: deriveTaprootReceiveAddressIndex({
          xpub: mainnetKeychainAtAccount(accountIndex).publicExtendedKey,
          index: 0,
          network: 'mainnet',
        })?.address,
        testnet: deriveTaprootReceiveAddressIndex({
          xpub: testnetKeychainAtAccount(accountIndex).publicExtendedKey,
          index: 0,
          network: 'testnet',
        })?.address,
      };
    },
    [mainnetKeychainAtAccount, testnetKeychainAtAccount]
  );
}

export function useCurrentAccountTaprootSigner() {
  const network = useCurrentNetwork();
  const accountKeychain = useCurrentTaprootAccountKeychain();
  if (!accountKeychain) return; // TODO: Revisit this return early
  const addressIndexKeychainFn = deriveAddressIndexKeychainFromAccount(accountKeychain);

  return (addressIndex: number) => {
    const addressIndexKeychain = addressIndexKeychainFn(addressIndex);
    return {
      payment: getTaprootPaymentFromAddressIndex(
        addressIndexKeychain,
        network.chain.bitcoin.network
      ),
      sign(tx: btc.Transaction) {
        if (!addressIndexKeychain.privateKey)
          throw new Error('Unable to sign taproot transaction, no private key found');

        tx.sign(addressIndexKeychain.privateKey);
      },
      signIndex(tx: btc.Transaction, index: number) {
        if (!addressIndexKeychain.privateKey)
          throw new Error('Unable to sign taproot transaction, no private key found');

        tx.signIdx(addressIndexKeychain.privateKey, index);
      },
    };
  };
}

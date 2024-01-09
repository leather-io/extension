import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { createSelector } from '@reduxjs/toolkit';
import { Psbt } from 'bitcoinjs-lib';

import {
  deriveAddressIndexZeroFromAccount,
  extractAddressIndexFromPath,
  lookUpLedgerKeysByPath,
} from '@shared/crypto/bitcoin/bitcoin.utils';
import {
  deriveNativeSegwitAccountFromRootKeychain,
  getNativeSegWitPaymentFromAddressIndex,
  getNativeSegwitAccountDerivationPath,
} from '@shared/crypto/bitcoin/p2wpkh-address-gen';
import { BitcoinInputSigningConfig } from '@shared/crypto/bitcoin/signer-config';
import { reverseBytes } from '@shared/utils';

import { mnemonicToRootNode } from '@app/common/keychain/keychain';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { selectCurrentNetwork } from '@app/store/networks/networks.selectors';
import { selectCurrentAccountIndex } from '@app/store/software-keys/software-key.selectors';

import { useCurrentAccountIndex } from '../../account';
import {
  bitcoinAccountBuilderFactory,
  useBitcoinExtendedPublicKeyVersions,
} from './bitcoin-keychain';
import {
  bitcoinAddressIndexSignerFactory,
  useMakeBitcoinNetworkSignersForPaymentType,
} from './bitcoin-signer';

const selectNativeSegwitAccountBuilder = bitcoinAccountBuilderFactory(
  deriveNativeSegwitAccountFromRootKeychain,
  lookUpLedgerKeysByPath(getNativeSegwitAccountDerivationPath)
);

const selectCurrentNetworkNativeSegwitAccountBuilder = createSelector(
  selectNativeSegwitAccountBuilder,
  selectCurrentNetwork,
  (nativeSegwitKeychains, network) => nativeSegwitKeychains[network.chain.bitcoin.bitcoinNetwork]
);

export function useNativeSegwitAccountBuilder() {
  return useSelector(selectCurrentNetworkNativeSegwitAccountBuilder);
}

const selectCurrentNativeSegwitAccount = createSelector(
  selectCurrentNetworkNativeSegwitAccountBuilder,
  selectCurrentAccountIndex,
  (generateAccount, accountIndex) => generateAccount(accountIndex)
);

export function useCurrentNativeSegwitAccount() {
  return useSelector(selectCurrentNativeSegwitAccount);
}

export function useNativeSegwitNetworkSigners() {
  const { mainnet: mainnetKeychain, testnet: testnetKeychain } = useSelector(
    selectNativeSegwitAccountBuilder
  );

  return useMakeBitcoinNetworkSignersForPaymentType(
    mainnetKeychain,
    testnetKeychain,
    getNativeSegWitPaymentFromAddressIndex
  );
}

export function useNativeSegwitSigner(accountIndex: number) {
  const account = useNativeSegwitAccountBuilder()(accountIndex);
  const extendedPublicKeyVersions = useBitcoinExtendedPublicKeyVersions();

  return useMemo(() => {
    if (!account) return;
    return bitcoinAddressIndexSignerFactory({
      accountIndex,
      accountKeychain: account.keychain,
      paymentFn: getNativeSegWitPaymentFromAddressIndex,
      network: account.network,
      extendedPublicKeyVersions,
    });
  }, [account, accountIndex, extendedPublicKeyVersions]);
}

export function useCurrentAccountNativeSegwitSigner() {
  const currentAccountIndex = useCurrentAccountIndex();
  return useNativeSegwitSigner(currentAccountIndex);
}

// TODO: as ledger users are able to have only stacks account on their devices, this hook throws an unnecessary error.
// To alleviate that, use useCurrentAccountNativeSegwitIndexZeroSignerNullable
export function useCurrentAccountNativeSegwitIndexZeroSigner() {
  const signer = useCurrentAccountNativeSegwitSigner();
  return useMemo(() => {
    if (!signer) throw new Error('No signer');
    return signer(0);
  }, [signer]);
}

export function useCurrentAccountNativeSegwitIndexZeroSignerNullable() {
  const signer = useCurrentAccountNativeSegwitSigner();
  return useMemo(() => {
    if (!signer) return undefined;
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

export function getNativeSegwitMainnetAddressFromMnemonic(secretKey: string) {
  return (accountIndex: number) => {
    const rootNode = mnemonicToRootNode(secretKey);
    const account = deriveNativeSegwitAccountFromRootKeychain(rootNode, 'mainnet')(accountIndex);
    return getNativeSegWitPaymentFromAddressIndex(
      deriveAddressIndexZeroFromAccount(account.keychain),
      'mainnet'
    );
  };
}

export function useUpdateLedgerSpecificNativeSegwitUtxoHexForAdddressIndexZero() {
  const bitcoinClient = useBitcoinClient();

  return async (tx: Psbt, inputSigningConfig: BitcoinInputSigningConfig[]) => {
    const inputsTxHex = await Promise.all(
      tx.txInputs.map(input =>
        bitcoinClient.transactionsApi.getBitcoinTransactionHex(
          // txids are encoded onchain in reverse byte order
          reverseBytes(input.hash).toString('hex')
        )
      )
    );
    inputSigningConfig.forEach(({ index }) => {
      tx.updateInput(index, {
        nonWitnessUtxo: Buffer.from(inputsTxHex[index], 'hex'),
      });
    });
  };
}

export function useUpdateLedgerSpecificNativeSegwitBip32DerivationForAdddressIndexZero() {
  const createNativeSegwitSigner = useCurrentAccountNativeSegwitSigner();

  return async (tx: Psbt, fingerprint: string, inputSigningConfig: BitcoinInputSigningConfig[]) => {
    inputSigningConfig.forEach(({ index, derivationPath }) => {
      const nativeSegwitSigner = createNativeSegwitSigner?.(
        extractAddressIndexFromPath(derivationPath)
      );

      if (!nativeSegwitSigner)
        throw new Error(`Unable to update input for path ${derivationPath}}`);

      tx.updateInput(index, {
        bip32Derivation: [
          {
            masterFingerprint: Buffer.from(fingerprint, 'hex'),
            pubkey: Buffer.from(nativeSegwitSigner.publicKey),
            path: derivationPath,
          },
        ],
      });
    });
  };
}

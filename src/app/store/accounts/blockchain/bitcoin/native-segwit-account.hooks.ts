import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { createSelector } from '@reduxjs/toolkit';
import * as btc from '@scure/btc-signer';
import { Psbt, networks } from 'bitcoinjs-lib';
import AppClient from 'ledger-bitcoin';

import {
  bitcoinNetworkModeToCoreNetworkMode,
  deriveAddressIndexZeroFromAccount,
  lookUpLedgerKeysByPath,
} from '@shared/crypto/bitcoin/bitcoin.utils';
import {
  deriveNativeSegwitAccountFromRootKeychain,
  getNativeSegWitPaymentFromAddressIndex,
  getNativeSegwitAccountDerivationPath,
} from '@shared/crypto/bitcoin/p2wpkh-address-gen';
import { logger } from '@shared/logger';
import { reverseBytes } from '@shared/utils';

import { mnemonicToRootNode } from '@app/common/keychain/keychain';
import {
  addSignatureToPsbt,
  createNativeSegwitDefaultWalletPolicy,
} from '@app/features/ledger/utils/bitcoin-ledger-utils';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
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

const selectNativeSegwitAccountBuilder = bitcoinAccountBuilderFactory(
  deriveNativeSegwitAccountFromRootKeychain,
  lookUpLedgerKeysByPath(getNativeSegwitAccountDerivationPath)
);

const selectCurrentNetworkNativeSegwitAccountBuilder = createSelector(
  selectNativeSegwitAccountBuilder,
  selectCurrentNetwork,
  (nativeSegwitKeychain, network) =>
    nativeSegwitKeychain[bitcoinNetworkModeToCoreNetworkMode(network.chain.bitcoin.network)]
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

function useNativeSegwitSigner(accountIndex: number) {
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

export function useSignNativeSegwitLedgerTx() {
  const accountIndex = useCurrentAccountIndex();
  const network = useCurrentNetwork();
  const signer = useCurrentAccountNativeSegwitIndexZeroSigner();
  const bitcoinClient = useBitcoinClient();

  return async (app: AppClient, rawPsbt: Uint8Array) => {
    const fingerprint = await app.getMasterFingerprint();

    const extendedPublicKey = await app.getExtendedPubkey(
      getNativeSegwitAccountDerivationPath(network.chain.bitcoin.network, accountIndex)
    );

    // BtcSigner not compatible with Ledger. Encoded format returns more terse
    // version. BitcoinJsLib works.
    const psbt = Psbt.fromBuffer(Buffer.from(rawPsbt), { network: networks.testnet });

    const inputsTxHex = await Promise.all(
      psbt.txInputs.map(input =>
        bitcoinClient.transactionsApi.getBitcoinTransactionHex(
          // txids are encoded onchain in reverse byte order
          reverseBytes(input.hash).toString('hex')
        )
      )
    );

    for (let i = 0; i < psbt.inputCount; i++) {
      psbt.updateInput(i, {
        // On device warning if we don't add this
        nonWitnessUtxo: Buffer.from(inputsTxHex[i], 'hex'),
        // Required for Ledger signing
        bip32Derivation: [
          {
            masterFingerprint: Buffer.from(fingerprint, 'hex'),
            pubkey: Buffer.from(signer.publicKey),
            path: signer.derivationPath,
          },
        ],
      });
    }

    const policy = createNativeSegwitDefaultWalletPolicy({
      fingerprint,
      accountIndex,
      network: network.chain.bitcoin.network,
      xpub: extendedPublicKey,
    });

    try {
      const signatures = await app.signPsbt(psbt.toBase64(), policy, null);

      addSignatureToPsbt(psbt, signatures);

      // Ledger doesn't sign PSBTs coming from signer lib. So, we're using
      // BitcoinJs to create PSBT to sign, then we turn it back into a BtcSigner
      // PSBT type.
      const btcSignerPsbt = btc.Transaction.fromPSBT(psbt.toBuffer());
      btcSignerPsbt.finalize();

      return btcSignerPsbt;
    } catch (e) {
      logger.error('Failed signing BTC transaction on Ledger', e);
    } finally {
      await app.transport.close();
    }

    return null;
  };
}

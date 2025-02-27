import { useCallback } from 'react';

import { HDKey, Versions } from '@scure/bip32';
import * as btc from '@scure/btc-signer';
import { SigHash } from '@scure/btc-signer';

import {
  BitcoinAccount,
  BitcoinSigner,
  deriveAddressIndexKeychainFromAccount,
  makeNativeSegwitAddressIndexDerivationPath,
  makeTaprootAddressIndexDerivationPath,
  whenPaymentType,
} from '@leather.io/bitcoin';
import type { BitcoinNetworkModes } from '@leather.io/models';

import { useBitcoinExtendedPublicKeyVersions } from './bitcoin-keychain';

enum SignatureHash {
  DEFAULT = 0x00,
  ALL = 0x01,
  NONE = 0x02,
  SINGLE = 0x03,
  ALL_ANYONECANPAY = 0x81,
  NONE_ANYONECANPAY = 0x82,
  SINGLE_ANYONECANPAY = 0x83,
}
export const allSighashTypes = [
  SigHash.DEFAULT,
  SignatureHash.ALL,
  SignatureHash.NONE,
  SignatureHash.SINGLE,
  SigHash.ALL_ANYONECANPAY,
  SignatureHash.ALL_ANYONECANPAY,
  SignatureHash.NONE_ANYONECANPAY,
  SignatureHash.SINGLE_ANYONECANPAY,
];
type AllowedSighashTypes = SignatureHash | SigHash;

interface MakeBitcoinSignerArgs {
  keychain: HDKey;
  network: BitcoinNetworkModes;
  derivationPath: string;
  paymentFn(keychain: HDKey, network: BitcoinNetworkModes): any;
  signFn(tx: btc.Transaction): void;
  signAtIndexFn(tx: btc.Transaction, index: number, allowedSighash?: AllowedSighashTypes[]): void;
}
function makeBitcoinSigner<T extends MakeBitcoinSignerArgs>(args: T) {
  const { derivationPath, keychain, network, paymentFn, signFn, signAtIndexFn } = args;
  const payment = paymentFn(keychain, network) as ReturnType<T['paymentFn']>;
  return {
    network,
    payment,
    derivationPath,
    keychain,
    get address() {
      if (!payment.address) throw new Error('Unable to get address from payment');
      return payment.address;
    },
    get publicKey() {
      if (!keychain.publicKey) throw new Error('Unable to get publicKey from keychain');
      return keychain.publicKey;
    },
    sign: signFn as T['signFn'],
    signIndex: signAtIndexFn as T['signAtIndexFn'],
  };
}

interface BitcoinAddressIndexSignerFactoryArgs {
  accountIndex: number;
  accountKeychain: HDKey;
  paymentFn(keychain: HDKey, network: BitcoinNetworkModes): any;
  network: BitcoinNetworkModes;
  extendedPublicKeyVersions?: Versions;
}
export function bitcoinAddressIndexSignerFactory<T extends BitcoinAddressIndexSignerFactoryArgs>(
  args: T
) {
  const { accountIndex, network, paymentFn, accountKeychain, extendedPublicKeyVersions } = args;
  return (addressIndex: number): BitcoinSigner<ReturnType<T['paymentFn']>> => {
    const addressIndexKeychain =
      deriveAddressIndexKeychainFromAccount(accountKeychain)(addressIndex);

    const payment = paymentFn(addressIndexKeychain, network);

    return makeBitcoinSigner({
      keychain: HDKey.fromExtendedKey(
        addressIndexKeychain.publicExtendedKey,
        extendedPublicKeyVersions
      ),
      network,
      derivationPath: whenPaymentType(payment.type)({
        p2wpkh: makeNativeSegwitAddressIndexDerivationPath(network, accountIndex, addressIndex),
        p2tr: makeTaprootAddressIndexDerivationPath(network, accountIndex, addressIndex),
        'p2wpkh-p2sh': 'Not supported',
        p2pkh: 'Not supported',
        p2sh: 'Not supported',
      }),
      paymentFn,
      signFn(tx: btc.Transaction) {
        if (!addressIndexKeychain.privateKey)
          throw new Error('Unable to sign transaction, no private key found');

        tx.sign(addressIndexKeychain.privateKey);
      },
      // TODO: Revisit allowedSighash type if/when fixed in btc-signer
      signAtIndexFn(tx: btc.Transaction, index: number, allowedSighash?: number[]) {
        if (!addressIndexKeychain.privateKey)
          throw new Error('Unable to sign transaction, no private key found');

        tx.signIdx(addressIndexKeychain.privateKey, index, allowedSighash);
      },
    });
  };
}

interface CreateSignersForAllNetworkTypesArgs {
  paymentFn(keychain: HDKey, network: BitcoinNetworkModes): unknown;
  mainnetKeychainFn(accountIndex: number): BitcoinAccount | undefined;
  testnetKeychainFn(accountIndex: number): BitcoinAccount | undefined;
  extendedPublicKeyVersions?: Versions;
}
function createSignersForAllNetworkTypes<T extends CreateSignersForAllNetworkTypesArgs>({
  mainnetKeychainFn,
  testnetKeychainFn,
  paymentFn,
  extendedPublicKeyVersions,
}: T) {
  return ({ accountIndex, addressIndex }: { accountIndex: number; addressIndex: number }) => {
    const networkMap = new Map();

    function makeNetworkSigner(keychain: HDKey, network: BitcoinNetworkModes) {
      return bitcoinAddressIndexSignerFactory({
        accountIndex,
        accountKeychain: keychain,
        paymentFn: paymentFn as T['paymentFn'],
        network,
        extendedPublicKeyVersions,
      })(addressIndex);
    }

    const mainnetAccount = mainnetKeychainFn(accountIndex);
    if (mainnetAccount) {
      networkMap.set('mainnet', makeNetworkSigner(mainnetAccount.keychain, 'mainnet'));
    }

    const testnetAccount = testnetKeychainFn(accountIndex);
    if (testnetAccount) {
      networkMap.set('testnet', makeNetworkSigner(testnetAccount.keychain, 'testnet'));
      networkMap.set('regtest', makeNetworkSigner(testnetAccount.keychain, 'regtest'));
      networkMap.set('signet', makeNetworkSigner(testnetAccount.keychain, 'signet'));
    }

    return Object.fromEntries(networkMap);
  };
}

export function useMakeBitcoinNetworkSignersForPaymentType<T>(
  mainnetKeychainFn: (index: number) => BitcoinAccount | undefined,
  testnetKeychainFn: (index: number) => BitcoinAccount | undefined,
  paymentFn: (keychain: HDKey, network: BitcoinNetworkModes) => T
) {
  const extendedPublicKeyVersions = useBitcoinExtendedPublicKeyVersions();

  return useCallback(
    (accountIndex: number) => {
      const zeroIndex = 0;

      return createSignersForAllNetworkTypes({
        mainnetKeychainFn,
        testnetKeychainFn,
        paymentFn,
        extendedPublicKeyVersions,
      })({ accountIndex, addressIndex: zeroIndex });
    },
    [extendedPublicKeyVersions, mainnetKeychainFn, paymentFn, testnetKeychainFn]
  );
}

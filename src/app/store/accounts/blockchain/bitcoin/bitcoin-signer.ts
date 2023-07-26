import { useCallback } from 'react';

import { HDKey, Versions } from '@scure/bip32';
import * as btc from '@scure/btc-signer';

import { BitcoinNetworkModes } from '@shared/constants';
import {
  BitcoinAccount,
  deriveAddressIndexKeychainFromAccount,
  whenPaymentType,
} from '@shared/crypto/bitcoin/bitcoin.utils';
import { getTaprootAddressIndexDerivationPath } from '@shared/crypto/bitcoin/p2tr-address-gen';
import { getNativeSegwitAddressIndexDerivationPath } from '@shared/crypto/bitcoin/p2wpkh-address-gen';
import { AllowedSighashTypes } from '@shared/rpc/methods/sign-psbt';

interface Signer<Payment> {
  network: BitcoinNetworkModes;
  payment: Payment;
  keychain: HDKey;
  derivationPath: string;
  address: string;
  publicKey: Uint8Array;
  sign(tx: btc.Transaction): void;
  signIndex(tx: btc.Transaction, index: number, allowedSighash?: AllowedSighashTypes[]): void;
}

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
  return (addressIndex: number): Signer<ReturnType<T['paymentFn']>> => {
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
        p2wpkh: getNativeSegwitAddressIndexDerivationPath(network, accountIndex, addressIndex),
        p2tr: getTaprootAddressIndexDerivationPath(network, accountIndex, addressIndex),
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
  paymentFn: (keychain: HDKey, network: BitcoinNetworkModes) => unknown;
  mainnetKeychainFn: (accountIndex: number) => BitcoinAccount | undefined;
  testnetKeychainFn: (accountIndex: number) => BitcoinAccount | undefined;
}
function createSignersForAllNetworkTypes<T extends CreateSignersForAllNetworkTypesArgs>({
  mainnetKeychainFn,
  testnetKeychainFn,
  paymentFn,
}: T) {
  return ({ accountIndex, addressIndex }: { accountIndex: number; addressIndex: number }) => {
    const mainnetAccount = mainnetKeychainFn(accountIndex);
    const testnetAccount = testnetKeychainFn(accountIndex);

    if (!mainnetAccount || !testnetAccount) throw new Error('No account found');

    function makeNetworkSigner(keychain: HDKey, network: BitcoinNetworkModes) {
      return bitcoinAddressIndexSignerFactory({
        accountIndex,
        accountKeychain: keychain,
        paymentFn: paymentFn as T['paymentFn'],
        network,
      })(addressIndex);
    }

    return {
      mainnet: makeNetworkSigner(mainnetAccount.keychain, 'mainnet'),
      testnet: makeNetworkSigner(testnetAccount.keychain, 'testnet'),
      regtest: makeNetworkSigner(testnetAccount.keychain, 'regtest'),
      signet: makeNetworkSigner(testnetAccount.keychain, 'signet'),
    };
  };
}

export function useMakeBitcoinNetworkSignersForPaymentType<T>(
  mainnetKeychainFn: (index: number) => BitcoinAccount | undefined,
  testnetKeychainFn: (index: number) => BitcoinAccount | undefined,
  paymentFn: (keychain: HDKey, network: BitcoinNetworkModes) => T
) {
  return useCallback(
    (accountIndex: number) => {
      const zeroIndex = 0;

      return createSignersForAllNetworkTypes({
        mainnetKeychainFn,
        testnetKeychainFn,
        paymentFn,
      })({ accountIndex, addressIndex: zeroIndex });
    },
    [mainnetKeychainFn, paymentFn, testnetKeychainFn]
  );
}

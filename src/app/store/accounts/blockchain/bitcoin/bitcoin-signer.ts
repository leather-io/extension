import { useCallback } from 'react';

import { HDKey } from '@scure/bip32';
import * as btc from '@scure/btc-signer';

import { BitcoinNetworkModes } from '@shared/constants';
import {
  BitcoinAccount,
  deriveAddressIndexKeychainFromAccount,
  whenPaymentType,
} from '@shared/crypto/bitcoin/bitcoin.utils';
import { getTaprootAddressIndexDerivationPath } from '@shared/crypto/bitcoin/p2tr-address-gen';
import { getNativeSegwitAddressIndexDerivationPath } from '@shared/crypto/bitcoin/p2wpkh-address-gen';

interface BitcoinSignerFactoryArgs {
  accountIndex: number;
  accountKeychain: HDKey;
  paymentFn(keychain: HDKey, network: BitcoinNetworkModes): any;
  network: BitcoinNetworkModes;
}
export function bitcoinSignerFactory<T extends BitcoinSignerFactoryArgs>(args: T) {
  const { accountIndex, network, paymentFn, accountKeychain } = args;
  return (addressIndex: number) => {
    const addressIndexKeychain =
      deriveAddressIndexKeychainFromAccount(accountKeychain)(addressIndex);

    const payment = paymentFn(addressIndexKeychain, network) as ReturnType<T['paymentFn']>;

    const publicKeychain = HDKey.fromExtendedKey(addressIndexKeychain.publicExtendedKey);

    return {
      network,
      payment,
      addressIndex,
      publicKeychain,
      derivationPath: whenPaymentType(payment.type)({
        p2wpkh: getNativeSegwitAddressIndexDerivationPath(network, accountIndex, addressIndex),
        p2tr: getTaprootAddressIndexDerivationPath(network, accountIndex, addressIndex),
        'p2wpkh-p2sh': 'Not supported',
        p2pkh: 'Not supported',
        p2sh: 'Not supported',
      }),
      get address() {
        if (!payment.address) throw new Error('Unable to get address from payment');
        return payment.address;
      },
      get publicKey() {
        if (!publicKeychain.publicKey) throw new Error('Unable to get publicKey from keychain');
        return publicKeychain.publicKey;
      },
      sign(tx: btc.Transaction) {
        if (!addressIndexKeychain.privateKey)
          throw new Error('Unable to sign taproot transaction, no private key found');

        tx.sign(addressIndexKeychain.privateKey);
      },
      signIndex(tx: btc.Transaction, index: number, allowedSighash?: btc.SignatureHash[]) {
        if (!addressIndexKeychain.privateKey)
          throw new Error('Unable to sign taproot transaction, no private key found');

        tx.signIdx(addressIndexKeychain.privateKey, index, allowedSighash);
      },
    };
  };
}

interface CreateSignersForAllNetworkTypesArgs {
  mainnetKeychainFn: (accountIndex: number) => BitcoinAccount;
  testnetKeychainFn: (accountIndex: number) => BitcoinAccount;
  paymentFn: (keychain: HDKey, network: BitcoinNetworkModes) => unknown;
}
function createSignersForAllNetworkTypes<T extends CreateSignersForAllNetworkTypesArgs>({
  mainnetKeychainFn,
  testnetKeychainFn,
  paymentFn,
}: T) {
  return ({ accountIndex, addressIndex }: { accountIndex: number; addressIndex: number }) => {
    const mainnetAccount = mainnetKeychainFn(accountIndex);
    const testnetAccount = testnetKeychainFn(accountIndex);

    function makeNetworkSigner(keychain: HDKey, network: BitcoinNetworkModes) {
      return bitcoinSignerFactory({
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
  mainnetKeychainFn: ((index: number) => BitcoinAccount) | undefined,
  testnetKeychainFn: ((index: number) => BitcoinAccount) | undefined,
  paymentFn: (keychain: HDKey, network: BitcoinNetworkModes) => T
) {
  return useCallback(
    (accountIndex: number) => {
      if (!mainnetKeychainFn || !testnetKeychainFn)
        throw new Error('Cannot derive addresses in non-software mode');

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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ecc from '@bitcoinerlab/secp256k1';
import { sha256 } from '@noble/hashes/sha256';
import { base58check } from '@scure/base';
import { HDKey } from '@scure/bip32';
import { mnemonicToSeedSync } from '@scure/bip39';
import { hashP2WPKH } from '@stacks/transactions';
import { BIP32Factory } from 'bip32';
import * as bitcoin from 'bitcoinjs-lib';

import {
  decodeCompressedWifPrivateKey,
  deriveBtcBip49SeedFromMnemonic,
  deriveRootBtcKeychain,
  makePayToScriptHashAddress,
  makePayToScriptHashAddressBytes,
  makePayToScriptHashKeyHash,
  payToScriptHashTestnetPrefix,
  publicKeyToPayToScriptHashAddress,
} from './p2wsh-p2sh-address-gen';

describe('Bitcoin SegWit (P2WPKH-P2SH) address generation', () => {
  const bip32 = BIP32Factory(ecc);

  const phrase =
    'above view guide write long gift chimney own guide mirror word ski code monster gauge bracket until stem feed scale smart truth toy limb';

  describe('Verify against wagyu results', () => {
    // Keys generated with `wagyu`
    // $ wagyu bitcoin import-hd -m "<phrase>" -d "m/49'/0'/0'/0/0" --format segwit --json
    const keys = [
      {
        path: "m/49'/0'/0'/0/0",
        extended_private_key:
          'xprvA2WTEJy9NLu57C55yCCPvXLzGq6mGjL3oc81T7vMv2WYREFuAJV3HT4pJYF4a3JRCnyU95rgq4eY2X6cCJTJQYEHmHrvyfy5pCnPcqeTikK',
        extended_public_key:
          'xpub6FVodpW3CiTNKg9Z5DjQHfHiprwFgC3uAq3cFWKyUN3XJ2b3hqoHqFPJ9p9r4QK5f9fs1VztRMrjSy6M6HvVLtpC6KipJ2whmAhk9V3GZZ2',
        private_key: 'L5iYDFDUDSGnjtWUT8gKDvCcsfMna5fAk6pQo5DZandks5r7Av4Q',
        public_key: '03715f44ce96a11743c97e4ef5954e78482107a9658f1c5f33bc9e70dc171e56e5',
        address: '3CTTwjVZ59ykFH2DSQpF3iLWM3fESjFcJ9',
        format: 'p2sh_p2wpkh',
        network: 'mainnet',
      },
      {
        path: "m/49'/0'/0'/0/1",
        extended_private_key:
          'xprvA2WTEJy9NLu5ANouN242mgeiXNcndxwCRHRj3B3C96zWPj7Cgp22frkXKLGiRK59fg6nkGHHityZkVdjBfp7oLP8gf2jy2iHf21qaTWHQfd',
        extended_public_key:
          'xpub6FVodpW3CiTNNrtNU3b38pbT5QTH3Rf3nWMKqZSohSXVGXSMEMLHDf51AZpFphHQXCZzAMXGHraNyBmRXHKbgKQETn8mr6oUTAXBYJJBGEy',
        private_key: 'L4Xt5Ricu9HAg3t92uyqNpnFXKXCgt6DuUtVMkaTsqgXs7rnxjSY',
        public_key: '02166ce8acc10a07f877436d673c1876ad2b68d7c78075972d4b2d9f8e1d0d984d',
        address: '36R4QBx4HqRSiRswcFeCe6KUgk2JY9aP87',
        format: 'p2sh_p2wpkh',
        network: 'mainnet',
      },
      {
        path: "m/49'/0'/0'/0/2",
        extended_private_key:
          'xprvA2WTEJy9NLu5E4vHyjZWFKoTnibqRqNquBzPR7sRoMn44bvpq6ES7cbRmxmxZAtiTDFvRUFWzpsYqbuNF4WapLdJJzrYTDDY6k4QhqHEkXG',
        extended_public_key:
          'xpub6FVodpW3CiTNSYzm5m6WcTkCLkSKqJ6hGQuzDWH3MhK2wQFyNdYgfQuudCnLj4afakVMnLpHBuAY13aHFh3giri7MRZ8gEddLtr9wdgcvpn',
        private_key: 'L2aBwidPCi2YjxDriNAtxfrMFbS3PsKeUUSnnt8cQQRKvpPciUqo',
        public_key: '0218e2229c75d57f2a0bd6dfdfa50a1a736d19fb40a1f18a675d34960b088df01e',
        address: '3BU1wA95ELhgweMSazGh42CHD5K64XGUop',
        format: 'p2sh_p2wpkh',
        network: 'mainnet',
      },
      {
        path: "m/49'/0'/0'/0/3",
        extended_private_key:
          'xprvA2WTEJy9NLu5FKNrRe3coYxbKXjjzibJ6uouC9v29s6Ut8KJvmqXWmvzPTb9wPfRjYzvcq91QyV6B7P38XmZpTquTDoVyp4vv5baiyf8EZT',
        extended_public_key:
          'xpub6FVodpW3CiTNToTKXfadAguKsZaEQBK9U8jVzYKdiCdTkveTUK9n4aFUEiuixKhQeqrrqX9iKTYFmpJXdc2im8y2JzYCuiEZvegLuTAetxJ',
        private_key: 'L2Mx4mkmuQMnRxf1gCYSSEugDj6TeDS45eYjXYdanJ7MEX9Xp8Fe',
        public_key: '02bf94312be9021d61d1ed917c5e8542d215180afe5db35c5574e3382b3b8469f0',
        address: '3MCzNqbNy7k8hnyenwpsdHahY2yBVQJQsz',
        format: 'p2sh_p2wpkh',
        network: 'mainnet',
      },
    ] as const;

    describe.each(keys)('Core libraries: bip32, bip39, bitcoinjs-lib', key => {
      const seed = mnemonicToSeedSync(phrase);
      const root = bip32.fromSeed(Buffer.from(seed));
      const child = root.derivePath(key.path);

      describe(key.path, () => {
        test(`public key`, () => expect(child.publicKey.toString('hex')).toEqual(key.public_key));

        test(`extended public key`, () =>
          expect(child.neutered().toBase58()).toEqual(key.extended_public_key));

        test(`private key`, () =>
          expect(child.privateKey).toEqual(
            Buffer.from(decodeCompressedWifPrivateKey(key.private_key))
          ));

        test(`extended private key`, () =>
          expect(child.privateKey).toEqual(bip32.fromBase58(key.extended_private_key).privateKey));

        test(`segwit address`, () => {
          const bitcoinPayment = bitcoin.payments.p2sh({
            redeem: bitcoin.payments.p2wpkh({ pubkey: child.publicKey }),
          });
          expect(bitcoinPayment.address).toEqual(key.address);
        });
      });
    });

    describe.each(keys)('@scure/*', key => {
      let seed: Uint8Array;
      let root: HDKey;
      let child: HDKey;

      beforeAll(async () => {
        seed = await deriveBtcBip49SeedFromMnemonic(phrase);
        root = deriveRootBtcKeychain(seed);
        child = root.derive(key.path);
      });

      describe(key.path, () => {
        test(`public key`, () =>
          expect(Buffer.from(child.publicKey!).toString('hex')).toEqual(key.public_key));

        test(`extended public key`, () =>
          expect(child.publicExtendedKey).toEqual(key.extended_public_key));

        test(`private key`, () =>
          expect(child.privateKey).toEqual(decodeCompressedWifPrivateKey(key.private_key)));

        test(`extended private key`, () =>
          expect(child.privateKey).toEqual(
            HDKey.fromExtendedKey(key.extended_private_key).privateKey
          ));

        test(`extended private key`, () =>
          expect(child.privateExtendedKey).toEqual(key.extended_private_key));

        test(`segwit address`, () => {
          expect(publicKeyToPayToScriptHashAddress(child.publicKey!, key.network)).toEqual(
            key.address
          );
        });
      });
    });
  });

  // Replicating test vector from BIP
  // https://en.bitcoin.it/wiki/BIP_0049
  test('BIP-0049 test vector', () => {
    const publicKey = Buffer.from(
      '03a1af804ac108a8a51782198c2d034b28bf90c8803f5a53f76276fa69a4eae77f',
      'hex'
    );
    const hash = makePayToScriptHashKeyHash(publicKey);

    // stacks.js implementation
    const addressBytesFromStacks = hashP2WPKH(publicKey);
    expect(addressBytesFromStacks).toEqual('336caa13e08b96080a32b5d818d59b4ab3b36742');

    // wallet implementation
    const addressBytes = makePayToScriptHashAddressBytes(hash);
    const addressBytesHex = Buffer.from(addressBytes).toString('hex');
    expect(addressBytesHex).toEqual('336caa13e08b96080a32b5d818d59b4ab3b36742');

    // compare lib output
    expect(addressBytesFromStacks).toEqual(addressBytesHex);

    const address = base58check(sha256).encode(
      Buffer.concat([
        Buffer.of(payToScriptHashTestnetPrefix),
        Buffer.from(addressBytesFromStacks, 'hex'),
      ])
    );
    const addressWithLib = makePayToScriptHashAddress(addressBytes, 'testnet');

    expect(address).toEqual(addressWithLib);

    expect(addressWithLib).toEqual('2Mww8dCYPUpKHofjgcXcBCEGmniw9CoaiD2');
  });
});

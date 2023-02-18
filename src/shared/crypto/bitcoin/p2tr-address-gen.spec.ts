import * as secp from '@noble/secp256k1';
import { HDKey } from '@scure/bip32';
import { mnemonicToSeedSync } from '@scure/bip39';
import { SECRET_KEY } from '@tests-legacy/mocks';
import * as btc from 'micro-btc-signer';

import { getBtcSignerLibNetworkByMode } from './bitcoin.network';

// Source:
// generated in Sparrow with same secret key used in tests
const addresses = [
  'tb1p05uectcay8ptepqneycknxf0ewvdejcl0zdqex98ux87w7tzqjfsd7yxyl',
  'tb1papsqvj9s2yn9mavhtuk9jyw4arlwcxey33n49g02rpjcajx88qrszpytxl',
  'tb1pfnegsp8x0gnjrgzu0p5xrltrms50prpl8c5a3rwfcrp9p9vumnfsv7zn84',
  'tb1pzqp06cvvcmftc4g69kuqt5z59k3uyuuwzsg796c00scav0vxjevs3gsvpr',
  'tb1p2acyvr7wzvdr2m9fprg2e48k03rjvvq8au680jtrxqrz5m9m5kdsurrp2z',
  'tb1p3kautzlyralsnxf2fv7rudlgyhu6u0lcvzdnlhaywl4h8l7yk0ds59lvfg',
];

describe('taproot address gen', () => {
  test.each(addresses)('should generate taproot addresses', address => {
    const keychain = HDKey.fromMasterSeed(mnemonicToSeedSync(SECRET_KEY));
    const index = addresses.indexOf(address);
    const accountZero = keychain.derive(`m/86'/1'/0'/0/${index}`);

    if (!accountZero.privateKey) throw new Error('No private key found');

    const addressIndex = btc.p2tr(
      secp.schnorr.getPublicKey(accountZero.privateKey),
      undefined,
      getBtcSignerLibNetworkByMode('testnet')
    );
    expect(addressIndex.address).toEqual(address);
  });
});

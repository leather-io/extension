import { HDKey } from '@scure/bip32';
import { mnemonicToSeedSync } from '@scure/bip39';
import * as btc from '@scure/btc-signer';
import { STANDARD_BIP_FAKE_MNEMONIC } from '@tests/mocks/constants';

import {
  deriveAddressIndexKeychainFromAccount,
  ecdsaPublicKeyToSchnorr,
  getNativeSegwitAccountDerivationPath,
  getTaprootAccountDerivationPath,
} from '@leather.io/bitcoin';
import { makeNumberRange } from '@leather.io/utils';

import { getAssumedZeroIndexSigningConfig } from './signer-config';

describe(getAssumedZeroIndexSigningConfig.name, () => {
  const seed = mnemonicToSeedSync(STANDARD_BIP_FAKE_MNEMONIC);
  const keychain = HDKey.fromMasterSeed(seed);

  const mockTxid = '7fc33a83ba9627b8eeb0eebef90552f73518f27a45dbdc41bd6bd4342d098bf3';

  test('for a given transaction with p2wpkh', () => {
    const nativeSegwitAccountKeychain = keychain.derive(
      getNativeSegwitAccountDerivationPath('mainnet', 0)
    );
    const nativeSegwitKeychain = deriveAddressIndexKeychainFromAccount(nativeSegwitAccountKeychain)(
      0
    );
    const nativeSegwitPayment = btc.p2wpkh(nativeSegwitKeychain.publicKey!);

    const testTx = new btc.Transaction();
    testTx.addInput({
      index: 5,
      txid: mockTxid,
      witnessUtxo: {
        amount: 1000n,
        script: nativeSegwitPayment.script,
      },
    });
    const result = getAssumedZeroIndexSigningConfig({
      psbt: testTx.toPSBT(),
      network: 'mainnet',
    }).forAccountIndex(0);

    expect(result).toEqual([{ derivationPath: "m/84'/0'/0'/0/0", index: 0 }]);
  });

  const taprootAccountKeychain = keychain.derive(getTaprootAccountDerivationPath('mainnet', 0));
  const taprootKeychain = deriveAddressIndexKeychainFromAccount(taprootAccountKeychain)(0);
  const taprootPayment = btc.p2tr(ecdsaPublicKeyToSchnorr(taprootKeychain.publicKey!));

  test('for a given transaction with p2tr', () => {
    const testTx = new btc.Transaction();
    testTx.addInput({
      index: 0,
      txid: mockTxid,
      witnessUtxo: { amount: 1000n, script: taprootPayment.script },
    });

    const result = getAssumedZeroIndexSigningConfig({
      psbt: testTx.toPSBT(),
      network: 'testnet',
    }).forAccountIndex(0);

    expect(result).toEqual([{ derivationPath: "m/86'/1'/0'/0/0", index: 0 }]);
  });

  test('it only returns config for inputs given, if passed', () => {
    const testTx = new btc.Transaction();
    makeNumberRange(5).forEach(index =>
      testTx.addInput({
        // Index of the UTXO being spend on the txid, not its order in new tx
        index: index * 2,
        txid: mockTxid,
        witnessUtxo: { amount: 1000n, script: taprootPayment.script },
      })
    );
    const result = getAssumedZeroIndexSigningConfig({
      psbt: testTx.toPSBT(),
      network: 'mainnet',
      indexesToSign: [0, 2, 4],
    }).forAccountIndex(99);

    expect(result).toEqual([
      { derivationPath: "m/86'/0'/99'/0/0", index: 0 },
      { derivationPath: "m/86'/0'/99'/0/0", index: 2 },
      { derivationPath: "m/86'/0'/99'/0/0", index: 4 },
    ]);
  });
});

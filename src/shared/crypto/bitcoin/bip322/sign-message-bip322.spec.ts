import * as secp from '@noble/secp256k1';
import * as btc from '@scure/btc-signer';
import { bytesToHex } from '@stacks/common';
import * as bitcoin from 'bitcoinjs-lib';

import { ecdsaPublicKeyToSchnorr } from '../bitcoin.utils';
import {
  createNativeSegwitBitcoinJsSigner,
  createTaprootBitcoinJsSigner,
  createToSpendTx,
  signBip322MessageSimple,
} from './sign-message-bip322-bitcoinjs';

describe(createToSpendTx.name, () => {
  test('bitcoinjs example', () => {
    const result = createToSpendTx(
      'bc1q9vza2e8x573nczrlzms0wvx3gsqjx7vavgkx0l',
      'generatedWithBitcoinJs',
      'mainnet'
    );

    expect(result.script.toString('hex')).toEqual('00142b05d564e6a7a33c087f16e0f730d1440123799d');

    expect(result.virtualToSpend.toHex()).toEqual(
      '00000000010000000000000000000000000000000000000000000000000000000000000000ffffffff220020093bbd44da65116318b960749b3d6172ab9775b5d1923a7c71e18845c6524852000000000100000000000000001600142b05d564e6a7a33c087f16e0f730d1440123799d00000000'
    );
  });
});

//
// https://github.com/bitcoin/bips/blob/master/bip-0322.mediawiki#test-vectors
describe(signBip322MessageSimple.name, () => {
  const testVectorKey = btc.WIF().decode('L3VFeEujGtevx9w18HD1fhRbCH67Az2dpCymeRE1SoPK6XQtaN2k');

  describe('Message signing, Native Segwit', () => {
    const nativeSegwitAddress = btc.getAddress('wpkh', testVectorKey);
    const payment = btc.p2wpkh(secp.getPublicKey(testVectorKey, true));

    async function signPsbt(psbt: bitcoin.Psbt) {
      psbt.signAllInputs(createNativeSegwitBitcoinJsSigner(Buffer.from(testVectorKey)));
      return btc.Transaction.fromPSBT(psbt.toBuffer());
    }

    if (!nativeSegwitAddress) throw new Error('nativeSegwitAddress is undefined');

    test('Addresses against native segwit test vectors', () => {
      expect(nativeSegwitAddress).toEqual('bc1q9vza2e8x573nczrlzms0wvx3gsqjx7vavgkx0l');
      expect(payment.address).toEqual('bc1q9vza2e8x573nczrlzms0wvx3gsqjx7vavgkx0l');
    });

    test('Signature: "" (empty string)', async () => {
      const {
        virtualToSpend: emptyStringToSpend,
        virtualToSign: emptyStringToSign,
        signature: emptyStringSig,
      } = await signBip322MessageSimple({
        address: nativeSegwitAddress,
        message: '',
        network: 'mainnet',
        signPsbt,
      });
      expect(emptyStringToSpend.getId()).toEqual(
        'c5680aa69bb8d860bf82d4e9cd3504b55dde018de765a91bb566283c545a99a7'
      );
      expect(emptyStringToSign.getId()).toEqual(
        '1e9654e951a5ba44c8604c4de6c67fd78a27e81dcadcfe1edf638ba3aaebaed6'
      );

      // Signature
      // Bip322 says:
      // AkcwRAIgM2gBAQqvZX15ZiysmKmQpDrG83avLIT492QBzLnQIxYCIBaTpOaD20qRlEylyxFSeEA2ba9YOixpX8z46TSDtS40ASECx/EgAxlkQpQ9hYjgGu6EBCPMVPwVIVJqO4XCsMvViHI=
      expect(emptyStringSig).toEqual(
        'AkgwRQIhAPkJ1Q4oYS0htvyuSFHLxRQpFAY56b70UvE7Dxazen0ZAiAtZfFz1S6T6I23MWI2lK/pcNTWncuyL8UL+oMdydVgzAEhAsfxIAMZZEKUPYWI4BruhAQjzFT8FSFSajuFwrDL1Yhy'
      );
    });

    const helloWorld = 'Hello World';
    test(`Signature: "${helloWorld}"`, async () => {
      const { virtualToSpend, virtualToSign, unencodedSig, signature } =
        await signBip322MessageSimple({
          address: nativeSegwitAddress,
          message: helloWorld,
          network: 'mainnet',
          signPsbt,
        });

      // section 3
      expect(virtualToSpend.getId()).toEqual(
        'b79d196740ad5217771c1098fc4a4b51e0535c32236c71f1ea4d61a2d603352b'
      );

      // sectuion 4.3 expectedid
      expect(virtualToSign.getId()).toEqual(
        '88737ae86f2077145f93cc4b153ae9a1cb8d56afa511988c149c5c8c9d93bddf'
      );

      // sectioun 5.2 witness
      expect(virtualToSign.ins[0].witness.map(bytesToHex).join(' ')).toEqual(
        '3045022100ecf2ca796ab7dde538a26bfb09a6c487a7b3fff33f397db6a20eb9af77c0ee8c022062e67e44c8070f49c3a37f5940a8850842daf7cca35e6af61a6c7c91f1e1a1a301 02c7f12003196442943d8588e01aee840423cc54fc1521526a3b85c2b0cbd58872'
      );

      expect(unencodedSig.toString('hex')).toEqual(
        '02483045022100ecf2ca796ab7dde538a26bfb09a6c487a7b3fff33f397db6a20eb9af77c0ee8c022062e67e44c8070f49c3a37f5940a8850842daf7cca35e6af61a6c7c91f1e1a1a3012102c7f12003196442943d8588e01aee840423cc54fc1521526a3b85c2b0cbd58872'
      );

      // Signature
      // Bip322 says:
      // AkcwRAIgZRfIY3p7/DoVTty6YZbWS71bc5Vct9p9Fia83eRmw2QCICK/ENGfwLtptFluMGs2KsqoNSk89pO7F29zJLUx9a/sASECx/EgAxlkQpQ9hYjgGu6EBCPMVPwVIVJqO4XCsMvViHI=
      expect(signature).toEqual(
        'AkgwRQIhAOzyynlqt93lOKJr+wmmxIens//zPzl9tqIOua93wO6MAiBi5n5EyAcPScOjf1lAqIUIQtr3zKNeavYabHyR8eGhowEhAsfxIAMZZEKUPYWI4BruhAQjzFT8FSFSajuFwrDL1Yhy'
      );
    });
  });

  describe('Message Signing, Taproot', () => {
    const taprootAddress = btc.getAddress('tr', testVectorKey);
    console.log('taprootAddress', taprootAddress);

    if (!taprootAddress) throw new Error('Could not generate taproot address');

    const payment = btc.p2tr(
      ecdsaPublicKeyToSchnorr(secp.getPublicKey(Buffer.from(testVectorKey), true))
    );

    async function signPsbt(psbt: bitcoin.Psbt) {
      psbt.data.inputs.forEach(
        input => (input.tapInternalKey = Buffer.from(payment.tapInternalKey))
      );
      psbt.signAllInputs(createTaprootBitcoinJsSigner(Buffer.from(testVectorKey)));
      return btc.Transaction.fromPSBT(psbt.toBuffer());
    }

    test('Addresses against taproot test vectors', () => {
      expect(taprootAddress).toEqual(
        'bc1ppv609nr0vr25u07u95waq5lucwfm6tde4nydujnu8npg4q75mr5sxq8lt3'
      );
      expect(payment.address).toEqual(
        'bc1ppv609nr0vr25u07u95waq5lucwfm6tde4nydujnu8npg4q75mr5sxq8lt3'
      );
    });

    // Taproot signatures verified with verifymessage request to node
    test('Signature: "" (empty string)', async () => {
      const { signature } = await signBip322MessageSimple({
        address: taprootAddress,
        message: '',
        network: 'mainnet',
        signPsbt,
      });

      expect(signature).toEqual(
        'AUD4DxC7li8RxVkoC/H27LIZnaBD/ZCyZOjjVTzyQf7wa1kYMuyv1uX7XshysTXVR05HbexLSChXuGSoZcqJl6zF'
      );
    });

    test('Signature: "WearLeather"', async () => {
      const { signature } = await signBip322MessageSimple({
        address: taprootAddress,
        message: 'WearLeather',
        network: 'mainnet',
        signPsbt,
      });

      expect(signature).toEqual(
        'AUDjK8SJX34boek3m3EKXI94AMBZynJUmdqgO7i4z6JKG6gkUgp+brkWl0ylzWb+8enM4s4B4TWel0iCmcQrKNWS'
      );
    });
  });
});

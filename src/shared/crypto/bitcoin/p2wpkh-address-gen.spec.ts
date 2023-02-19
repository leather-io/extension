import { deriveNativeSegWitReceiveAddressIndex } from './p2wpkh-address-gen';

describe('Bitcoin bech32 (P2WPKH address derivation', () => {
  describe('from extended public key', () => {
    const accounts = [
      {
        path: "m/84'/0'/0'",
        extended_public_key:
          'xpub6CwY13JDrzeY2oWjP9dbiyLHQh3JVWCvBTCfD7WREBUpBUmtCu4bgxfSGrvaLDbZaMdw2nsPeTFv6AokWkVqh4rbKpsxg7GgEu543Qwvyff',
        private_key: 'L1FA9VHZNkgCBW9fS76zDHcjuK72LE4gGVAMnN67onRRCoDJvZJi',
        public_key: '0211758b68eb9b0e4e9610c49739f2ce039732033ba47e125bbdf64ef6cd586ef3',
        zeroIndexChildAddress: 'bc1qa4ypkks2kfpawyy5mautjfqc6wv703ckm7puux',
      },
      {
        path: "m/84'/0'/1'",
        mnemonic:
          'token spatial butter drill city debate pipe shoot target pencil tonight gallery dog globe copy hybrid convince spell load maximum impose crazy engage way',
        extended_public_key:
          'xpub6CwY13JDrzeY55xGbiHxHwZSZpbkmrM7QMag3yVgZi62zaYFsBAUam1kghZZx4hDgDdkDzAMxc8xmpcyGAb1EoXoB7Vn7WTiUEaCEd3CcPq',
        private_key: 'Kyhx4Zz1iYmCGx1gLnPE5ZFphBf16BoRKokU6B8KbxkJ7tM511de',
        public_key: '025f6abba7947109c5e5ba0fed5e7b99b0ce5b06ccbca86539e6eca261c4507559',
        zeroIndexChildAddress: 'bc1q5aptjy5l9q4qcykvccpwlqcvzydg744qkv94d3',
      },
      {
        path: "m/84'/0'/2'",
        mnemonic:
          'token spatial butter drill city debate pipe shoot target pencil tonight gallery dog globe copy hybrid convince spell load maximum impose crazy engage way',
        extended_public_key:
          'xpub6CwY13JDrzeY7qyP5MCBqA3hmB9oX8mjpbt6YWPfCRb9fus8Yrt84xxzh1Ci2wyW8intyoxmr3MjCHCtbs458uboWZVV8WFeHZBveJHVG71',
        private_key: 'L1CzwqocLUQgH6GeH6bBKRaRnGLF81249Wbd14uTzLaUGE5qMdD7',
        public_key: '022b804094c9b74a93d51e6bb3b1ae8378027e810058bbcb34ac54f3a307a225d1',
        zeroIndexChildAddress: 'bc1q253fdeyzuwx58xxssd3a2xw2gq7khhpmr6vgnh',
      },
    ];

    describe.each(accounts)('Account', account => {
      const keychain = deriveNativeSegWitReceiveAddressIndex({
        xpub: account.extended_public_key,
        network: 'mainnet',
      });
      test('bech 32 address', () =>
        expect(keychain?.address).toEqual(account.zeroIndexChildAddress));
    });
  });
});

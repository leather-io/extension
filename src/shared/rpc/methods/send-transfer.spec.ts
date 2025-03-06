import {
  convertRpcSendTransferLegacyParamsToNew,
  rpcSendTransferParamsSchema,
  rpcSendTransferParamsSchemaLegacy,
} from './send-transfer';

describe('`sendTransfer` method', () => {
  describe('schema validation', () => {
    test('that it validates single recipient sends', () => {
      const params = {
        network: 'mainnet',
        account: 0,
        address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
        amount: '10000',
      };

      expect(rpcSendTransferParamsSchemaLegacy.safeParse(params).success).toEqual(true);
    });

    test('that it validates multiple recipient sends', () => {
      const params = {
        network: 'mainnet',
        account: 0,
        recipients: [
          {
            address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
            amount: '10000',
          },
          {
            address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
            amount: '800',
          },
        ],
      };

      expect(rpcSendTransferParamsSchema.safeParse(params).success).toEqual(true);
    });

    test('that it fails validation for missing required fields', () => {
      const params = {
        network: 'mainnet',
        account: 0,
      };

      expect(() => rpcSendTransferParamsSchema.parse(params)).toThrow();
    });

    test('that it converts legacy params to new params', () => {
      const legacyParams = {
        network: 'mainnet',
        account: 0,
        address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
        amount: '10000',
      };

      const newParams = {
        network: 'mainnet',
        account: 0,
        recipients: [
          {
            address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
            amount: '10000',
          },
        ],
      };

      expect(convertRpcSendTransferLegacyParamsToNew(legacyParams)).toEqual(newParams);
    });
  });

  test('that it fails if addresses do not match the defined network', () => {
    const result = rpcSendTransferParamsSchema.safeParse({
      network: 'mainnet',
      account: 0,
      recipients: [
        {
          // Expected to fail because we've passed a testnet address
          address: 'tb1pjqhc5xw5xuhhg3zvk5p545q055e4farx37pvwnj2plt9t8lezvys0n58yz',
          amount: '10000',
        },
      ],
    });
    expect(result.success).toEqual(false);
  });

  test('that it fails when addresses of different networks are passed', () => {
    const result = rpcSendTransferParamsSchema.safeParse({
      network: 'mainnet',
      account: 0,
      recipients: [
        {
          address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
          amount: '100',
        },
        {
          address: 'tb1pjqhc5xw5xuhhg3zvk5p545q055e4farx37pvwnj2plt9t8lezvys0n58yz',
          amount: '100',
        },
      ],
    });
    expect(result.error?.issues.map(issue => issue.message)).toContain(
      'Cannot transfer to addresses of different networks'
    );
    expect(result.success).toEqual(false);
  });

  test('that it supports regtest addresses', () => {
    const result = rpcSendTransferParamsSchema.safeParse({
      network: 'sbtcTestnet',
      account: 0,
      recipients: [
        {
          address: 'bcrt1pzxz00vdnc8j4rz6u9axp6jmh60f8v7t8zkmwzm4x3899fvvl78nseyz7r2',
          amount: '100',
        },
      ],
    });
    expect(result.success).toEqual(true);
  });
});

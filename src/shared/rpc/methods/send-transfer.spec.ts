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
        amount: '0.0001',
      };

      expect(rpcSendTransferParamsSchemaLegacy.isValidSync(params)).toBeTruthy();
    });

    test('that it validates multiple recipient sends', () => {
      const params = {
        network: 'mainnet',
        account: 0,
        recipients: [
          {
            address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
            amount: '0.0001',
          },
          {
            address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
            amount: '0.0001',
          },
        ],
      };

      expect(rpcSendTransferParamsSchema.isValidSync(params)).toBeTruthy();
    });

    test('that it fails validation for missing required fields', () => {
      const params = {
        network: 'mainnet',
        account: 0,
      };

      expect(() => rpcSendTransferParamsSchema.validateSync(params)).toThrow();
    });

    test('that it converts legacy params to new params', () => {
      const legacyParams = {
        network: 'mainnet',
        account: 0,
        address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
        amount: '0.0001',
      };

      const newParams = {
        network: 'mainnet',
        account: 0,
        recipients: [
          {
            address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
            amount: '0.0001',
          },
        ],
      };

      expect(convertRpcSendTransferLegacyParamsToNew(legacyParams)).toEqual(newParams);
    });
  });
});

import { HEYSTACK_HEY_TX_REQUEST } from '@tests/mocks';
import { getPayloadFromToken } from '@app/store/transactions/utils';
import { TransactionTypes } from '@stacks/connect';

describe(getPayloadFromToken.name, () => {
  it('verifies payload', () => {
    const result = getPayloadFromToken(HEYSTACK_HEY_TX_REQUEST);
    expect(result?.txType).toEqual(TransactionTypes.ContractCall);
  });
});

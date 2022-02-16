import { renderHook } from '@testing-library/react-hooks';
import { useAtomValue } from 'jotai/utils';
import { ProviderWithWalletAndRequestToken } from '@tests/state-utils';

import { setupHeystackEnv } from '@tests/mocks/heystack';

import { HEYSTACK_HEY_TX_REQUEST, HEYSTACK_HEY_TX_REQUEST_DECODED } from '@tests/mocks';
import { requestTokenState } from '@app/store/transactions/requests';
import { getPayloadFromToken } from '@app/store/transactions/utils';
import { TransactionTypes } from '@stacks/connect';

describe('transaction utils state', () => {
  setupHeystackEnv();
  it('correctly decoded', async () => {
    const { result } = renderHook(() => useAtomValue(requestTokenState), {
      wrapper: ProviderWithWalletAndRequestToken,
    });
    expect(result.current).toBeTruthy();
    const decoded = getPayloadFromToken(result.current as string);
    expect(decoded).toEqual(HEYSTACK_HEY_TX_REQUEST_DECODED);
  });
});

describe(getPayloadFromToken.name, () => {
  it('verifies payload', () => {
    const result = getPayloadFromToken(HEYSTACK_HEY_TX_REQUEST);
    console.log(result);
    expect(result?.txType).toEqual(TransactionTypes.ContractCall);
  });
});

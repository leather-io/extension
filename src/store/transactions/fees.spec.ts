import { useAtomValue } from 'jotai/utils';
import { renderHook } from '@testing-library/react-hooks';

import { feeState } from '@store/transactions/fees';
import { ProviderWithWalletAndRequestToken } from '@tests/state-utils';
import { setupHeystackEnv } from '@tests/mocks/heystack';

describe('transaction fees state', () => {
  setupHeystackEnv();
  it('sets fee estimation correctly', async () => {
    const { result } = renderHook(() => useAtomValue(feeState), {
      wrapper: ProviderWithWalletAndRequestToken,
    });
    expect(result.current).toBeTruthy();
    expect(result.current).toEqual(100000);
  });
});

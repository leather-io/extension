import { useAtomValue } from 'jotai/utils';

import { walletConfigState } from '@app/store/wallet/wallet';
import { renderHook } from '@testing-library/react-hooks';
import { ProviderWithTestWallet } from '@tests/state-utils';

describe('wallet state', () => {
  it('uses wallet config', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAtomValue(walletConfigState), {
      wrapper: ProviderWithTestWallet,
    });
    await waitForNextUpdate({ timeout: 10000 });
    expect(result.current?.accounts.length).toBeGreaterThan(0);
  });
});

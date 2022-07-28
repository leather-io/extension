import { renderHook } from '@testing-library/react-hooks';

import { useGetTransactionFeeEstimationQuery } from '@app/query/fees/fees.query';
import { setupHeystackEnv } from '@tests/mocks/heystack';
import { ProviderWithWalletAndRequestToken } from '@tests/state-utils';

describe('useGetTransactionFeeEstimation', () => {
  setupHeystackEnv();
  it('returns a successful query', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () =>
        useGetTransactionFeeEstimationQuery(
          350,
          '0x00051af942874ce525e87f21bbe8c121b12fac831d02f4000000000098968000000000000000000000000000000000000000000000000000000000000000000000'
        ),
      {
        wrapper: ProviderWithWalletAndRequestToken,
      }
    );
    await waitForNextUpdate({ timeout: 3000 });
    expect(result.current.isSuccess).toBeTruthy;
  });
});

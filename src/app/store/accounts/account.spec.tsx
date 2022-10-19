import { useAtomValue } from 'jotai/utils';
import { act, renderHook } from '@testing-library/react-hooks';

import { softwareAccountsState, accountsWithAddressState } from '@app/store/accounts/accounts';
import { ProviderWithTestWallet } from '@tests/state-utils';
import { TEST_ACCOUNTS_WITH_ADDRESS } from '@tests/mocks';

describe.skip('account state', () => {
  it('wallet has correct amount of accounts state', async () => {
    const { result } = renderHook(() => useAtomValue(softwareAccountsState), {
      wrapper: ProviderWithTestWallet,
    });
    expect(result.current?.length).toBe(4);
  });

  it('all addresses are correct for test accounts (mainnet)', async () => {
    const promise = Promise.resolve();
    const { result } = renderHook(() => useAtomValue(accountsWithAddressState), {
      wrapper: ProviderWithTestWallet,
    });
    expect(result.current).toEqual(TEST_ACCOUNTS_WITH_ADDRESS);
    await act(() => promise);
  });
});

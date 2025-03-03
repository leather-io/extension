import { recurseAccountsForActivity } from './account-restore';

describe(recurseAccountsForActivity.name, () => {
  test('case of account with activity at 6th index only', async () => {
    const mockHasActivityFn = vi.fn().mockImplementation((index: number) => {
      if (index <= 3) return true;
      return false;
    });
    const result = await recurseAccountsForActivity({
      doesAddressHaveActivityFn: mockHasActivityFn,
    });
    expect(result).toBe(3);
  });

  test('case of account with activity at 10th index only', async () => {
    const mockHasActivityFn = vi.fn().mockImplementation((index: number) => {
      if (index === 10) return true;
      return false;
    });
    const result = await recurseAccountsForActivity({
      doesAddressHaveActivityFn: mockHasActivityFn,
    });
    expect(result).toBe(10);
    // Index + Min accounts to check + 1
    expect(mockHasActivityFn.mock.calls.length).toBe(35);
  });

  test('case of account with activity until 80th account', async () => {
    const mockHasActivityFn = vi.fn().mockImplementation((index: number) => {
      if (index < 80) return true;
      return false;
    });
    const result = await recurseAccountsForActivity({
      doesAddressHaveActivityFn: mockHasActivityFn,
    });
    expect(result).toBe(79);
    expect(mockHasActivityFn.mock.calls.length).toBe(55);
  });
});

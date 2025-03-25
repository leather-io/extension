import { describe, expect, it, vi } from 'vitest';

import { useBreakOnNonCompliantEntity } from './compliance-checker.hooks';
import { useCheckAddressComplianceQueries } from './compliance-checker.query';

// Mock the useCheckAddressComplianceQueries hook
vi.mock('./compliance-checker.query', () => ({
  useCheckAddressComplianceQueries: vi.fn(),
}));

// hook rendering mock similar to React Testing Library
function renderHook<T>(hookFn: (...args: any[]) => T) {
  const result = { current: undefined as T | undefined };

  // Function to run the hook and update the result
  function rerender(...args: any[]) {
    result.current = hookFn(...args);
    return result;
  }

  // Initial render
  rerender();

  return {
    result,
    rerender,
  };
}

const mockQueryResult = {
  isSuccess: true,
  isError: false,
  isPending: false,
  isLoading: false,
  status: 'success',
  error: null,
  fetchStatus: 'idle',
  isLoadingError: false,
  isRefetchError: false,
  dataUpdatedAt: Date.now(),
  errorUpdatedAt: 0,
  failureCount: 0,
  failureReason: null,
  errorUpdateCount: 0,
  isInitialLoading: false,
  isPaused: false,
  promise: Promise.resolve(),
  isFetched: true,
  isFetchedAfterMount: true,
  isFetching: false,
  isPlaceholderData: false,
  isPreviousData: false,
  isRefetching: false,
  isStale: false,
  refetch: vi.fn(),
  remove: vi.fn(),
};

describe('useBreakOnNonCompliantEntity', () => {
  it('should return isCompliant true when no addresses are on sanctions list', () => {
    // Mock implementation for compliant addresses
    vi.mocked(useCheckAddressComplianceQueries).mockReturnValue([
      // TODO investigate this type error / if its worth adding tests
      // @ts-expect-error - mockQueryResult is not a UseQueryResult
      { ...mockQueryResult, data: { isOnSanctionsList: false, risk: 'Low' } },
      // @ts-expect-error - mockQueryResult is not a UseQueryResult
      { ...mockQueryResult, data: { isOnSanctionsList: false, risk: 'Moderate' } },
    ]);

    const callback = vi.fn();

    const result = renderHook(() =>
      useBreakOnNonCompliantEntity({
        address: ['address1', 'address2'],
        nativeSegwitSignerAddress: 'signerAddress',
        callback,
      })
    );

    expect(result.result.current?.isCompliant).toBe(true);
    expect(callback).not.toHaveBeenCalled();
    expect(useCheckAddressComplianceQueries).toHaveBeenCalledWith([
      'signerAddress',
      'address1',
      'address2',
    ]);
  });

  it('should call callback and throw error when an address is on sanctions list', () => {
    // Mock implementation for non-compliant address
    vi.mocked(useCheckAddressComplianceQueries).mockReturnValue([
      // @ts-expect-error - mockQueryResult is not a UseQueryResult
      { ...mockQueryResult, data: { isOnSanctionsList: false, risk: 'Low' } },
      // @ts-expect-error - mockQueryResult is not a UseQueryResult
      { ...mockQueryResult, data: { isOnSanctionsList: true, risk: 'Severe' } },
    ]);

    const callback = vi.fn();

    expect(() => {
      renderHook(() =>
        useBreakOnNonCompliantEntity({
          address: ['address1', 'address2'],
          nativeSegwitSignerAddress: 'signerAddress',
          callback,
        })
      );
    }).toThrow();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should handle single address input', () => {
    // Mock implementation for compliant address
    vi.mocked(useCheckAddressComplianceQueries).mockReturnValue([
      // @ts-expect-error - mockQueryResult is not a UseQueryResult
      { ...mockQueryResult, data: { isOnSanctionsList: false, risk: 'Low' } },
      // @ts-expect-error - mockQueryResult is not a UseQueryResult
      { ...mockQueryResult, data: { isOnSanctionsList: false, risk: 'Moderate' } },
    ]);

    const callback = vi.fn();

    const { result } = renderHook(() =>
      useBreakOnNonCompliantEntity({
        address: 'singleAddress',
        nativeSegwitSignerAddress: 'signerAddress',
        callback,
      })
    );

    expect(result?.current?.isCompliant).toBe(true);
    expect(callback).not.toHaveBeenCalled();
    expect(useCheckAddressComplianceQueries).toHaveBeenCalledWith([
      'signerAddress',
      'singleAddress',
    ]);
  });

  it('should handle empty nativeSegwitSignerAddress', () => {
    // Mock implementation for compliant address
    vi.mocked(useCheckAddressComplianceQueries).mockReturnValue([
      // @ts-expect-error - mockQueryResult is not a UseQueryResult
      { ...mockQueryResult, data: { isOnSanctionsList: false, risk: 'Low' } },
    ]);

    const callback = vi.fn();

    const { result } = renderHook(() =>
      useBreakOnNonCompliantEntity({
        address: 'address1',
        nativeSegwitSignerAddress: '',
        callback,
      })
    );

    expect(result?.current?.isCompliant).toBe(true);
    expect(callback).not.toHaveBeenCalled();
    expect(useCheckAddressComplianceQueries).toHaveBeenCalledWith(['', 'address1']);
  });
});

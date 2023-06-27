import { calculateOutboundPendingTxsValue } from '../transactions-by-address.hooks';
import { mockAddress, mockPendingTxs1, mockPendingTxs2, mockPendingTxs3 } from './mock-txs';

describe(calculateOutboundPendingTxsValue.name, () => {
  test('should return 0 if no pending txs', () => {
    expect(calculateOutboundPendingTxsValue([], mockAddress)).toEqual(0);
  });

  test('should return sum of pending txs', () => {
    expect(calculateOutboundPendingTxsValue(mockPendingTxs1, mockAddress)).toEqual(14165);
    expect(calculateOutboundPendingTxsValue(mockPendingTxs2, mockAddress)).toEqual(28330);
    expect(calculateOutboundPendingTxsValue(mockPendingTxs3, mockAddress)).toEqual(14165);
  });
});

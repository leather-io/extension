import {
  mockBitcoinTestnetAddress,
  mockPendingTxs1,
  mockPendingTxs2,
  mockPendingTxs3,
} from '@tests/mocks/mock-btc-txs';

import { calculateOutboundPendingTxsValue } from './transactions-by-address.hooks';

describe(calculateOutboundPendingTxsValue.name, () => {
  test('that it returns 0 if there are no pending txs', () => {
    expect(calculateOutboundPendingTxsValue([], mockBitcoinTestnetAddress)).toEqual(0);
  });

  test('that it returns the correct total sum of pending txs', () => {
    expect(calculateOutboundPendingTxsValue(mockPendingTxs1, mockBitcoinTestnetAddress)).toEqual(
      14165
    );
    expect(calculateOutboundPendingTxsValue(mockPendingTxs2, mockBitcoinTestnetAddress)).toEqual(
      28330
    );
    expect(calculateOutboundPendingTxsValue(mockPendingTxs3, mockBitcoinTestnetAddress)).toEqual(
      14165
    );
  });
});

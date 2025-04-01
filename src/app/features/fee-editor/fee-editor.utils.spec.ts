import { createMarketPair } from '@leather.io/models';
import { createMoney, createMoneyFromDecimal } from '@leather.io/utils';

import type { Fee } from './fee-editor.context';
import { formatFeeItem } from './fee-editor.utils';

describe('formatFeeItem', () => {
  const mockMarketData = {
    current_price: 50000,
    currency: 'USD',
    pair: createMarketPair('BTC', 'USD'),
    price: createMoneyFromDecimal(50000, 'USD'),
  };

  const mockRawFee: Fee = {
    priority: 'standard',
    feeRate: 5,
    txFee: createMoney(1000, 'BTC'),
    time: '~10 minutes',
  };

  const mockNullRawFee: Fee = {
    priority: 'standard',
    feeRate: 5,
    txFee: null,
    time: '~10 minutes',
  };

  it('formats fee information correctly', () => {
    const result = formatFeeItem({
      fee: mockRawFee,
      feeType: 'fee-rate',
      marketData: mockMarketData,
    });

    expect(result).toEqual({
      titleLeft: 'Standard',
      captionLeft: '~10 minutes',
      titleRight: '0.00001000 BTC',
      captionRight: '5 sats/vB · $0.50',
    });
  });

  it('handles null fee values', () => {
    const result = formatFeeItem({
      fee: {
        ...mockNullRawFee,
      },
      feeType: 'fee-rate',
      marketData: mockMarketData,
    });

    expect(result.titleRight).toBe('N/A');
    expect(result.captionRight).toBe(null);
  });
});

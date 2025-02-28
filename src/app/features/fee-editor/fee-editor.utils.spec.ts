import { createMarketPair } from '@leather.io/models';
import { createMoney, createMoneyFromDecimal } from '@leather.io/utils';

import type { RawFee } from './fee-editor.context';
import { formatFeeForDisplay } from './fee-editor.utils';

describe('formatFeeForDisplay', () => {
  const mockMarketData = {
    current_price: 50000,
    currency: 'USD',
    pair: createMarketPair('BTC', 'USD'),
    price: createMoneyFromDecimal(50000, 'USD'),
  };

  const mockRawFee: RawFee = {
    type: 'standard',
    baseUnitFeeValue: createMoney(1000, 'BTC'),
    feeRate: 5,
    time: '~10 minutes',
  };

  it('formats fee information correctly', () => {
    const result = formatFeeForDisplay({
      rawFee: mockRawFee,
      marketData: mockMarketData,
    });

    expect(result).toEqual({
      feeType: 'standard',
      feeRate: 5,
      baseUnitsValue: 1000,
      titleLeft: 'Standard',
      captionLeft: '~10 minutes',
      titleRight: '0.00001000 BTC',
      captionRight: '5 sats/vB · $0.50',
    });
  });

  it('handles null fee values', () => {
    const result = formatFeeForDisplay({
      rawFee: {
        ...mockRawFee,
        baseUnitFeeValue: null,
        feeRate: null,
      },
      marketData: mockMarketData,
    });

    expect(result.titleRight).toBe('N/A');
    expect(result.captionRight).toBe('N/A');
  });
});

import { createMarketPair } from '@leather.io/models';
import { createMoneyFromDecimal } from '@leather.io/utils';

import type { RawFee } from './bitcoin-fees.utils';
import { formatBitcoinFeeForDisplay } from './format-bitcoin-fee';

describe('formatBitcoinFeeForDisplay', () => {
  const mockMarketData = {
    current_price: 50000,
    currency: 'USD',
    pair: createMarketPair('BTC', 'USD'),
    price: createMoneyFromDecimal(50000, 'USD'),
  };

  const mockRawFee: RawFee = {
    type: 'standard',
    baseUnitsFeeValue: 1000,
    feeRate: 5,
    time: '~10 minutes',
  };

  it('formats fee information correctly', () => {
    const result = formatBitcoinFeeForDisplay({
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
    const result = formatBitcoinFeeForDisplay({
      rawFee: {
        ...mockRawFee,
        baseUnitsFeeValue: null,
        feeRate: null,
      },
      marketData: mockMarketData,
    });

    expect(result.titleRight).toBe('N/A');
    expect(result.captionRight).toBe('N/A');
  });
});

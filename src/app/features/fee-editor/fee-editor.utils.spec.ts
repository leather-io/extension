import { createMarketPair } from '@leather.io/models';
import { createMoney, createMoneyFromDecimal } from '@leather.io/utils';

import type { EditorFee } from './fee-editor.context';
import { formatEditorFeeItem } from './fee-editor.utils';

describe('formatEditorFeeItem', () => {
  const mockMarketData = {
    current_price: 50000,
    currency: 'USD',
    pair: createMarketPair('BTC', 'USD'),
    price: createMoneyFromDecimal(50000, 'USD'),
  };

  const mockRawFee: EditorFee = {
    type: 'standard',
    feeValue: createMoney(1000, 'BTC'),
    feeRate: 5,
    time: '~10 minutes',
  };

  it('formats fee information correctly', () => {
    const result = formatEditorFeeItem({
      editorFee: mockRawFee,
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
    const result = formatEditorFeeItem({
      editorFee: {
        ...mockRawFee,
        feeValue: null,
        feeRate: null,
      },
      marketData: mockMarketData,
    });

    expect(result.titleRight).toBe('N/A');
    expect(result.captionRight).toBe('N/A');
  });
});

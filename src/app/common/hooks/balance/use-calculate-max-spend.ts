import { useCallback } from 'react';

import { type UtxoResponseItem } from '@leather.io/query';

import { calculateMaxBitcoinSpend } from '@app/common/transactions/bitcoin/fees/calculate-max-bitcoin-spend';
import { useAverageBitcoinFeeRates } from '@app/query/bitcoin/fees/fee-estimates.hooks';

export function useCalculateMaxBitcoinSpend() {
  const { data: feeRates } = useAverageBitcoinFeeRates();

  return useCallback(
    (address = '', utxos: UtxoResponseItem[], feeRate?: number) =>
      calculateMaxBitcoinSpend({
        address,
        utxos,
        feeRate,
        fetchedFeeRates: feeRates,
      }),
    [feeRates]
  );
}

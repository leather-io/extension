import { FeeCalculationTypes, FeeEstimations } from '@shared/models/fees/_fees.model';
import { BitcoinFeeEstimates } from '@shared/models/fees/bitcoin-fees.model';

import { satToBtc } from '@app/common/money/unit-conversion';

import { useGetBitcoinFeeEstimatesQuery } from './fee-estimates.query';

interface ParseBitcoinFeeEstimatesResponseArgs {
  feeEstimates: BitcoinFeeEstimates;
  txByteLength: number;
}

function parseBitcoinFeeEstimatesResponse({
  feeEstimates,
  txByteLength,
}: ParseBitcoinFeeEstimatesResponseArgs): FeeEstimations {
  // TODO: What block confirmations do we want to target here for low, middle, and high?
  return {
    blockchain: 'bitcoin',
    estimates: [
      {
        fee: satToBtc(feeEstimates['1']).multipliedBy(txByteLength).toNumber(),
        feeRate: feeEstimates['1'],
      },
      {
        fee: satToBtc(feeEstimates['5']).multipliedBy(txByteLength).toNumber(),
        feeRate: feeEstimates['5'],
      },
      {
        fee: satToBtc(feeEstimates['10']).multipliedBy(txByteLength).toNumber(),
        feeRate: feeEstimates['10'],
      },
    ],
    calculation: FeeCalculationTypes.Api,
  };
}

export function useBitcoinFeeEstimations(txByteLength: number) {
  return useGetBitcoinFeeEstimatesQuery({
    select: resp => parseBitcoinFeeEstimatesResponse({ feeEstimates: resp, txByteLength }),
  });
}

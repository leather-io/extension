import BigNumber from 'bignumber.js';

import { logger } from '@shared/logger';
import { FeeCalculationTypes, Fees } from '@shared/models/fees/_fees.model';
import { BitcoinFeeEstimates } from '@shared/models/fees/bitcoin-fees.model';
import { createMoney } from '@shared/models/money.model';

import { useGetBitcoinFeeEstimatesQuery } from './fee-estimates.query';

// TODO: What should we return as default fee values for bitcoin?
// const defaultBitcoinFeeEstimates: BitcoinFeeEstimate[] = [
//   { fee: createMoney(new BigNumber(0), 'BTC'), feeRate: 0 },
//   { fee: createMoney(new BigNumber(0), 'BTC'), feeRate: 0 },
//   { fee: createMoney(new BigNumber(0), 'BTC'), feeRate: 0 },
// ];

// export const defaultBitcoinFees: Fees = {
//   blockchain: 'bitcoin',
//   estimates: defaultBitcoinFeeEstimates,
//   calculation: FeeCalculationTypes.Default,
// };

interface ParseBitcoinFeeEstimatesResponseArgs {
  feeEstimates: BitcoinFeeEstimates;
  txByteLength: number;
}
function parseBitcoinFeeEstimatesResponse({
  feeEstimates,
  txByteLength,
}: ParseBitcoinFeeEstimatesResponseArgs): Fees {
  // TODO: What block confirmations do we want to target here for low, middle, and high?
  return {
    blockchain: 'bitcoin',
    estimates: [
      {
        fee: createMoney(new BigNumber(feeEstimates['1']).multipliedBy(txByteLength), 'BTC'),
        feeRate: feeEstimates['1'],
      },
      {
        fee: createMoney(new BigNumber(feeEstimates['5']).multipliedBy(txByteLength), 'BTC'),
        feeRate: feeEstimates['5'],
      },
      {
        fee: createMoney(new BigNumber(feeEstimates['10']).multipliedBy(txByteLength), 'BTC'),
        feeRate: feeEstimates['10'],
      },
    ],
    calculation: FeeCalculationTypes.Api,
  };
}

export function useBitcoinFees(txByteLength: number) {
  return useGetBitcoinFeeEstimatesQuery({
    onError: err => logger.error('Error getting bitcoin fee estimates', { err }),
    select: resp => parseBitcoinFeeEstimatesResponse({ feeEstimates: resp, txByteLength }),
  });
}

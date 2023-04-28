import BigNumber from 'bignumber.js';

import { logger } from '@shared/logger';

import { calculateMeanAverage } from '@app/common/math/calculate-averages';

import {
  useGetBitcoinAllFeeEstimatesQuery,
  useGetBitcoinMempoolApiFeeEstimatesQuery,
} from './fee-estimates.query';

export function useBitcoinFeeRate() {
  return useGetBitcoinMempoolApiFeeEstimatesQuery({
    onError: err => logger.error('Error getting bitcoin fee estimates', { err }),
  });
}

export function useAverageBitcoinFeeRate() {
  const { data: avgApiFeeRates, isLoading } = useGetBitcoinAllFeeEstimatesQuery({
    onError: err => logger.error('Error getting all apis bitcoin fee estimates', { err }),
    select: resp => {
      if (resp[0].status === 'rejected' && resp[1].status === 'rejected') {
        return null;
      }

      let mempoolApiFeeRates = null;
      if (resp[0].status === 'fulfilled') {
        mempoolApiFeeRates = resp[0].value;
      }

      let earnApiFeeRates = null;
      if (resp[1].status === 'fulfilled') {
        earnApiFeeRates = resp[1].value;
      }

      const fastestFees = [
        new BigNumber(mempoolApiFeeRates?.fastestFee ?? 0),
        new BigNumber(earnApiFeeRates?.fastestFee ?? 0),
      ].filter(fee => fee.isGreaterThan(0));

      const halfHourFees = [
        new BigNumber(mempoolApiFeeRates?.halfHourFee ?? 0),
        new BigNumber(earnApiFeeRates?.halfHourFee ?? 0),
      ].filter(fee => fee.isGreaterThan(0));

      const hourFees = [
        new BigNumber(mempoolApiFeeRates?.hourFee ?? 0),
        new BigNumber(earnApiFeeRates?.hourFee ?? 0),
      ].filter(fee => fee.isGreaterThan(0));

      // zero values for cases when one api is down
      return {
        fastestFee: calculateMeanAverage(fastestFees),
        halfHourFee: calculateMeanAverage(halfHourFees),
        hourFee: calculateMeanAverage(hourFees),
      };
    },
  });

  return { isLoading, avgApiFeeRates };
}

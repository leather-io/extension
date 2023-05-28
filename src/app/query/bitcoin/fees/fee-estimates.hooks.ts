import BigNumber from 'bignumber.js';

import { logger } from '@shared/logger';
import { AverageBitcoinFeeRates } from '@shared/models/fees/bitcoin-fees.model';

import { calculateMeanAverage } from '@app/common/math/calculate-averages';

import { useGetAllBitcoinFeeEstimatesQuery } from './fee-estimates.query';

export function useAverageBitcoinFeeRates() {
  const { data: avgApiFeeRates, isLoading } = useGetAllBitcoinFeeEstimatesQuery({
    onError: err => logger.error('Error getting all apis bitcoin fee estimates', { err }),
    select: (resp): AverageBitcoinFeeRates | null => {
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

      // zero values for cases when one api is down
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

      // use the highest fee rate for fastest fee
      const fastestFee = fastestFees.reduce((p, v) => (p.isGreaterThan(v) ? p : v));

      return {
        fastestFee,
        halfHourFee: calculateMeanAverage(halfHourFees),
        hourFee: calculateMeanAverage(hourFees),
      };
    },
  });

  return { isLoading, avgApiFeeRates };
}

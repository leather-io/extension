import { logger } from '@shared/logger';

import { useGetBitcoinFeeEstimatesQuery } from './fee-estimates.query';

export function useBitcoinFeeRate() {
  return useGetBitcoinFeeEstimatesQuery({
    onError: err => logger.error('Error getting bitcoin fee estimates', { err }),
  });
}

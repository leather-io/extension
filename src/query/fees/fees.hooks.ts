import { UseQueryResult } from 'react-query';

import { TransactionFeeEstimation } from '@models/fees-types';
import { useGetFeeEstimations } from '@query/fees/fees.query';

export function useFeeEstimationsQuery(
  transactionPayload: string,
  estimatedLen: number | null
): UseQueryResult<TransactionFeeEstimation, Error> {
  return useGetFeeEstimations(transactionPayload, estimatedLen);
}

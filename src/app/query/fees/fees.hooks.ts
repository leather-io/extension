import { UseQueryResult } from 'react-query';

import { TransactionFeeEstimation } from '@shared/models/fees-types';
import { useGetFeeEstimations } from '@app/query/fees/fees.query';

export function useFeeEstimationsQuery(
  transactionPayload: string,
  estimatedLen: number | null
): UseQueryResult<TransactionFeeEstimation, Error> {
  return useGetFeeEstimations(transactionPayload, estimatedLen);
}

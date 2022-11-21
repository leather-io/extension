import { BigNumber } from 'bignumber.js';

import { DEFAULT_FEE_RATE } from '@shared/constants';
import { StacksFeeEstimate } from '@shared/models/fees/stacks-fees.model';

export function getFeeEstimationsWithCappedValues(
  feeEstimations: StacksFeeEstimate[],
  feeEstimationsMaxValues: number[] | undefined,
  feeEstimationsMinValues: number[] | undefined
) {
  return feeEstimations.map((feeEstimation, index) => {
    if (
      feeEstimationsMaxValues &&
      new BigNumber(feeEstimation.fee).isGreaterThan(feeEstimationsMaxValues[index])
    ) {
      return { fee: feeEstimationsMaxValues[index], feeRate: 0 };
    } else if (
      feeEstimationsMinValues &&
      new BigNumber(feeEstimation.fee).isLessThan(feeEstimationsMinValues[index])
    ) {
      return { fee: feeEstimationsMinValues[index], feeRate: 0 };
    } else {
      return feeEstimation;
    }
  });
}

function calculateFeeFromFeeRate(txBytes: number, feeRate: number) {
  return new BigNumber(txBytes).multipliedBy(feeRate);
}

const marginFromDefaultFeeDecimalPercent = 0.1;

export function getDefaultSimulatedFeeEstimations(
  estimatedByteLength: number
): StacksFeeEstimate[] {
  const fee = calculateFeeFromFeeRate(estimatedByteLength, DEFAULT_FEE_RATE);
  return [
    { fee: fee.multipliedBy(1 - marginFromDefaultFeeDecimalPercent).toNumber(), feeRate: 0 },
    { fee: fee.toNumber(), feeRate: 0 },
    { fee: fee.multipliedBy(1 + marginFromDefaultFeeDecimalPercent).toNumber(), feeRate: 0 },
  ];
}

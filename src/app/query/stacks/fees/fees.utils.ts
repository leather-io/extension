import { BigNumber } from 'bignumber.js';

import { DEFAULT_FEE_RATE } from '@shared/constants';
import { FeeEstimate } from '@shared/models/fees-types';

export function getFeeEstimationsWithCappedValues(
  feeEstimations: FeeEstimate[],
  feeEstimationsMaxValues: number[] | undefined,
  feeEstimationsMinValues: number[] | undefined
) {
  return feeEstimations.map((feeEstimation, index) => {
    if (
      feeEstimationsMaxValues &&
      new BigNumber(feeEstimation.fee).isGreaterThan(feeEstimationsMaxValues[index])
    ) {
      return { fee: feeEstimationsMaxValues[index], fee_rate: 0 };
    } else if (
      feeEstimationsMinValues &&
      new BigNumber(feeEstimation.fee).isLessThan(feeEstimationsMinValues[index])
    ) {
      return { fee: feeEstimationsMinValues[index], fee_rate: 0 };
    } else {
      return feeEstimation;
    }
  });
}

function calculateFeeFromFeeRate(txBytes: number, feeRate: number) {
  return new BigNumber(txBytes).multipliedBy(feeRate);
}

const marginFromDefaultFeeDecimalPercent = 0.1;

export function getDefaultSimulatedFeeEstimations(estimatedByteLength: number): FeeEstimate[] {
  const fee = calculateFeeFromFeeRate(estimatedByteLength, DEFAULT_FEE_RATE);
  return [
    { fee: fee.multipliedBy(1 - marginFromDefaultFeeDecimalPercent).toNumber(), fee_rate: 0 },
    { fee: fee.toNumber(), fee_rate: 0 },
    { fee: fee.multipliedBy(1 + marginFromDefaultFeeDecimalPercent).toNumber(), fee_rate: 0 },
  ];
}

import { DEFAULT_FEE_RATE } from '@shared/constants';
import { FeeEstimation } from '@shared/models/fees-types';
import { BigNumber } from 'bignumber.js';

export function getFeeEstimationsWithMaxValues(
  feeEstimations: FeeEstimation[],
  feeEstimationsMaxValues: number[] | undefined
) {
  return feeEstimations.map((feeEstimation, index) => {
    if (
      feeEstimationsMaxValues &&
      new BigNumber(feeEstimation.fee).isGreaterThan(feeEstimationsMaxValues[index])
    ) {
      return { fee: feeEstimationsMaxValues[index], fee_rate: 0 };
    } else {
      return feeEstimation;
    }
  });
}

function calculateFeeFromFeeRate(txBytes: number, feeRate: number) {
  return new BigNumber(txBytes).multipliedBy(feeRate);
}

const marginFromDefaultFeeDecimalPercent = 0.1;

export function getDefaultSimulatedFeeEstimations(estimatedByteLength: number): FeeEstimation[] {
  const fee = calculateFeeFromFeeRate(estimatedByteLength, DEFAULT_FEE_RATE);
  return [
    { fee: fee.multipliedBy(1 - marginFromDefaultFeeDecimalPercent).toNumber(), fee_rate: 0 },
    { fee: fee.toNumber(), fee_rate: 0 },
    { fee: fee.multipliedBy(1 + marginFromDefaultFeeDecimalPercent).toNumber(), fee_rate: 0 },
  ];
}

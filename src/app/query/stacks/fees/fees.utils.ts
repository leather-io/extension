import { FeeCalculationTypes, Fees, Money, StacksFeeEstimate } from '@leather-wallet/models';
import type { FeeEstimation, StacksTxFeeEstimation } from '@leather-wallet/query';
import { createMoney } from '@leather-wallet/utils';
import { bytesToHex } from '@stacks/common';
import { StacksTransaction, serializePayload } from '@stacks/transactions';
import { BigNumber } from 'bignumber.js';

import { DEFAULT_FEE_RATE } from '@shared/constants';

const defaultFeesMaxValues = [500000, 750000, 2000000];
const defaultFeesMinValues = [2500, 3000, 3500];

export const defaultFeesMaxValuesAsMoney = [
  createMoney(defaultFeesMaxValues[0], 'STX'),
  createMoney(defaultFeesMaxValues[1], 'STX'),
  createMoney(defaultFeesMaxValues[2], 'STX'),
];
export const defaultFeesMinValuesAsMoney = [
  createMoney(defaultFeesMinValues[0], 'STX'),
  createMoney(defaultFeesMinValues[1], 'STX'),
  createMoney(defaultFeesMinValues[2], 'STX'),
];

export const defaultApiFeeEstimations: FeeEstimation[] = [
  { fee: defaultFeesMinValues[0], fee_rate: 0 },
  { fee: defaultFeesMinValues[1], fee_rate: 0 },
  { fee: defaultFeesMinValues[2], fee_rate: 0 },
];

const defaultStacksFeeEstimates: StacksFeeEstimate[] = [
  { fee: defaultFeesMinValuesAsMoney[0], feeRate: 0 },
  { fee: defaultFeesMinValuesAsMoney[1], feeRate: 0 },
  { fee: defaultFeesMinValuesAsMoney[2], feeRate: 0 },
];

export const defaultStacksFees: Fees = {
  blockchain: 'stacks',
  estimates: defaultStacksFeeEstimates,
  calculation: FeeCalculationTypes.Default,
};

export function feeEstimationQueryFailedSilently(feeEstimation: StacksTxFeeEstimation) {
  return !!(feeEstimation && (!!feeEstimation.error || !feeEstimation.estimations.length));
}

export function getEstimatedUnsignedStacksTxByteLength(transaction: StacksTransaction) {
  return transaction.serialize().byteLength;
}

export function getSerializedUnsignedStacksTxPayload(transaction: StacksTransaction) {
  return bytesToHex(serializePayload(transaction.payload));
}

export function getFeeEstimationsWithCappedValues(
  feeEstimations: StacksFeeEstimate[],
  feeEstimationsMaxValues: Money[] | undefined,
  feeEstimationsMinValues: Money[] | undefined
) {
  return feeEstimations.map((feeEstimation, index) => {
    if (
      feeEstimationsMaxValues &&
      feeEstimation.fee.amount.isGreaterThan(feeEstimationsMaxValues[index].amount)
    ) {
      return { fee: feeEstimationsMaxValues[index], feeRate: 0 };
    } else if (
      feeEstimationsMinValues &&
      feeEstimation.fee.amount.isLessThan(feeEstimationsMinValues[index].amount)
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
    {
      fee: createMoney(fee.multipliedBy(1 - marginFromDefaultFeeDecimalPercent), 'STX'),
      feeRate: 0,
    },
    { fee: createMoney(fee, 'STX'), feeRate: 0 },
    {
      fee: createMoney(fee.multipliedBy(1 + marginFromDefaultFeeDecimalPercent), 'STX'),
      feeRate: 0,
    },
  ];
}

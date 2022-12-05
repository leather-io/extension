import { bytesToHex } from '@stacks/common';
import { StacksTransaction, serializePayload } from '@stacks/transactions';
import { BigNumber } from 'bignumber.js';

import { DEFAULT_FEE_RATE } from '@shared/constants';
import { StacksFeeEstimate } from '@shared/models/fees/stacks-fees.model';
import { Money, createMoney } from '@shared/models/money.model';

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

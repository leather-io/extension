import { type UtxoResponseItem } from '@leather.io/query';
import { createMoney, formatMoneyPadded } from '@leather.io/utils';

import type { TransferRecipient } from '@shared/models/form.model';

import type { FeeType } from '@app/common/fees/use-fees';
import {
  type DetermineUtxosForSpendArgs,
  determineUtxosForSpend,
  determineUtxosForSpendAll,
} from '@app/common/transactions/bitcoin/coinselect/local-coin-selection';
import { getSizeInfo } from '@app/common/transactions/bitcoin/utils';

export function getBitcoinFee(determineUtxosForFeeArgs: DetermineUtxosForSpendArgs) {
  try {
    const { fee } = determineUtxosForSpend(determineUtxosForFeeArgs);
    return fee;
  } catch (error) {
    return null;
  }
}

export function getBitcoinSendMaxFee(determineUtxosForFeeArgs: DetermineUtxosForSpendArgs) {
  try {
    const { fee } = determineUtxosForSpendAll(determineUtxosForFeeArgs);
    return fee;
  } catch (error) {
    return null;
  }
}

export function getApproximateFee({
  feeRate,
  recipients,
  utxos,
}: {
  feeRate: number;
  recipients: TransferRecipient[];
  utxos: UtxoResponseItem[];
}) {
  const size = getSizeInfo({
    inputLength: utxos.length + 1,
    recipients,
  });
  return Math.ceil(size.txVBytes * feeRate);
}

export interface RawFee {
  type: FeeType;
  baseUnitsFeeValue: number | null;
  feeRate: number | null;
  time: string;
}

export function getBtcFeeValue(feeValue: number) {
  return formatMoneyPadded(createMoney(feeValue, 'BTC'));
}

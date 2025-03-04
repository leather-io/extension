import { type UtxoResponseItem } from '@leather.io/query';
import { createMoney } from '@leather.io/utils';

import type { TransferRecipient } from '@shared/models/form.model';

import {
  type DetermineUtxosForSpendArgs,
  determineUtxosForSpend,
  determineUtxosForSpendAll,
} from '@app/common/transactions/bitcoin/coinselect/local-coin-selection';
import { getSizeInfo } from '@app/common/transactions/bitcoin/utils';

export function getBitcoinFee(determineUtxosForFeeArgs: DetermineUtxosForSpendArgs) {
  try {
    const { fee } = determineUtxosForSpend(determineUtxosForFeeArgs);
    return createMoney(fee, 'BTC');
  } catch (error) {
    return null;
  }
}

export function getBitcoinSendMaxFee(determineUtxosForFeeArgs: DetermineUtxosForSpendArgs) {
  try {
    const { fee } = determineUtxosForSpendAll(determineUtxosForFeeArgs);
    return createMoney(fee, 'BTC');
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
  return createMoney(Math.ceil(size.txVBytes * feeRate), 'BTC');
}

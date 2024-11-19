import BigNumber from 'bignumber.js';

import type { AverageBitcoinFeeRates } from '@leather.io/models';
import type { UtxoResponseItem } from '@leather.io/query';
import { createMoney, satToBtc } from '@leather.io/utils';

import { filterUneconomicalUtxos, getSpendableAmount } from '../utils';

interface CalculateMaxBitcoinSpend {
  address: string;
  utxos: UtxoResponseItem[];
  fetchedFeeRates?: AverageBitcoinFeeRates;
  feeRate?: number;
}

export function calculateMaxBitcoinSpend({
  address,
  utxos,
  feeRate,
  fetchedFeeRates,
}: CalculateMaxBitcoinSpend) {
  if (!utxos.length || !fetchedFeeRates)
    return {
      spendAllFee: 0,
      amount: createMoney(0, 'BTC'),
      spendableBitcoin: new BigNumber(0),
    };

  const currentFeeRate = feeRate ?? fetchedFeeRates.halfHourFee.toNumber();

  const filteredUtxos = filterUneconomicalUtxos({
    utxos,
    feeRate: currentFeeRate,
    recipients: [{ address, amount: createMoney(0, 'BTC') }],
  });

  const { spendableAmount, fee } = getSpendableAmount({
    utxos: filteredUtxos,
    feeRate: currentFeeRate,
    recipients: [{ address, amount: createMoney(0, 'BTC') }],
    isSendMax: true,
  });

  return {
    spendAllFee: fee,
    amount: createMoney(spendableAmount, 'BTC'),
    spendableBitcoin: satToBtc(spendableAmount),
  };
}

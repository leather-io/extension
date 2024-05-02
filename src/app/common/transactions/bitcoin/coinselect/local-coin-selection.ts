import BigNumber from 'bignumber.js';
import { validate } from 'bitcoin-address-validation';

import type { TransferRecipient } from '@shared/models/form.model';

import { sumNumbers } from '@app/common/math/helpers';
import { sumMoney } from '@app/common/money/calculate-money';
import { UtxoResponseItem } from '@app/query/bitcoin/bitcoin-client';

import { filterUneconomicalUtxos, getSizeInfo } from '../utils';

export class InsufficientFundsError extends Error {
  constructor() {
    super('Insufficient funds');
  }
}

export interface DetermineUtxosForSpendArgs {
  feeRate: number;
  recipients: TransferRecipient[];
  utxos: UtxoResponseItem[];
}

function getUtxoTotal(utxos: UtxoResponseItem[]) {
  return sumNumbers(utxos.map(utxo => utxo.value));
}

export function determineUtxosForSpendAll({
  feeRate,
  recipients,
  utxos,
}: DetermineUtxosForSpendArgs) {
  recipients.forEach(recipient => {
    if (!validate(recipient.address))
      throw new Error('Cannot calculate spend of invalid address type');
  });
  const filteredUtxos = filterUneconomicalUtxos({ utxos, feeRate, recipients });

  const sizeInfo = getSizeInfo({
    inputLength: filteredUtxos.length,
    isSendMax: true,
    recipients,
  });

  // Fee has already been deducted from the amount with send all
  const outputs = recipients.map(({ address, amount }) => ({
    value: BigInt(amount.amount.toNumber()),
    address,
  }));

  const fee = Math.ceil(sizeInfo.txVBytes * feeRate);

  return {
    inputs: filteredUtxos,
    outputs,
    size: sizeInfo.txVBytes,
    fee,
  };
}

export function determineUtxosForSpend({ feeRate, recipients, utxos }: DetermineUtxosForSpendArgs) {
  recipients.forEach(recipient => {
    if (!validate(recipient.address))
      throw new Error('Cannot calculate spend of invalid address type');
  });
  const filteredUtxos = filterUneconomicalUtxos({
    utxos: utxos.sort((a, b) => b.value - a.value),
    feeRate,
    recipients,
  });
  if (!filteredUtxos.length) throw new InsufficientFundsError();

  const amount = sumMoney(recipients.map(recipient => recipient.amount));

  // Prepopulate with first UTXO, at least one is needed
  const neededUtxos: UtxoResponseItem[] = [filteredUtxos[0]];

  function estimateTransactionSize() {
    return getSizeInfo({
      inputLength: neededUtxos.length,
      recipients,
    });
  }

  function hasSufficientUtxosForTx() {
    const txEstimation = estimateTransactionSize();
    const neededAmount = new BigNumber(txEstimation.txVBytes * feeRate).plus(amount.amount);
    return getUtxoTotal(neededUtxos).isGreaterThanOrEqualTo(neededAmount);
  }

  function getRemainingUnspentUtxos() {
    return filteredUtxos.filter(utxo => !neededUtxos.includes(utxo));
  }

  while (!hasSufficientUtxosForTx()) {
    const [nextUtxo] = getRemainingUnspentUtxos();
    if (!nextUtxo) throw new InsufficientFundsError();
    neededUtxos.push(nextUtxo);
  }

  const fee = Math.ceil(
    new BigNumber(estimateTransactionSize().txVBytes).multipliedBy(feeRate).toNumber()
  );

  const outputs: {
    value: bigint;
    address?: string;
  }[] = [
    ...recipients.map(({ address, amount }) => ({
      value: BigInt(amount.amount.toNumber()),
      address,
    })),
    {
      value:
        BigInt(getUtxoTotal(neededUtxos).toString()) -
        BigInt(amount.amount.toNumber()) -
        BigInt(fee),
    },
  ];

  return {
    filteredUtxos,
    inputs: neededUtxos,
    outputs,
    size: estimateTransactionSize().txVBytes,
    fee,
    ...estimateTransactionSize(),
  };
}

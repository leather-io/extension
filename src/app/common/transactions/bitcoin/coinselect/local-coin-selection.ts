import { validate } from 'bitcoin-address-validation';

import { UtxoResponseItem } from '@app/query/bitcoin/bitcoin-client';

import { filterUneconomicalUtxos, getSizeInfo } from '../utils';

export interface DetermineUtxosForSpendArgs {
  amount: number;
  feeRate: number;
  recipient: string;
  utxos: UtxoResponseItem[];
}

export class InsufficientFundsError extends Error {
  constructor() {
    super('Insufficient funds');
  }
}

export function determineUtxosForSpendAll({
  amount,
  feeRate,
  recipient,
  utxos,
}: DetermineUtxosForSpendArgs) {
  if (!validate(recipient)) throw new Error('Cannot calculate spend of invalid address type');
  const filteredUtxos = filterUneconomicalUtxos({ utxos, feeRate, address: recipient });

  const sizeInfo = getSizeInfo({
    inputLength: filteredUtxos.length,
    outputLength: 1,
    recipient,
  });

  // Fee has already been deducted from the amount with send all
  const outputs = [{ value: BigInt(amount), address: recipient }];

  const fee = Math.ceil(sizeInfo.txVBytes * feeRate);

  return {
    inputs: filteredUtxos,
    outputs,
    size: sizeInfo.txVBytes,
    fee,
  };
}

export function determineUtxosForSpend({
  amount,
  feeRate,
  recipient,
  utxos,
}: DetermineUtxosForSpendArgs) {
  if (!validate(recipient)) throw new Error('Cannot calculate spend of invalid address type');

  const orderedUtxos = utxos.sort((a, b) => b.value - a.value);

  const filteredUtxos = filterUneconomicalUtxos({
    utxos: orderedUtxos,
    feeRate,
    address: recipient,
  });

  const neededUtxos = [];
  let sum = 0n;
  let sizeInfo = null;

  for (const utxo of filteredUtxos) {
    sizeInfo = getSizeInfo({
      inputLength: neededUtxos.length,
      outputLength: 2,
      recipient,
    });
    if (sum >= BigInt(amount) + BigInt(Math.ceil(sizeInfo.txVBytes * feeRate))) break;

    sum += BigInt(utxo.value);
    neededUtxos.push(utxo);
  }

  if (!sizeInfo) throw new InsufficientFundsError();

  const fee = Math.ceil(sizeInfo.txVBytes * feeRate);

  const outputs = [
    // outputs[0] = the desired amount going to recipient
    { value: BigInt(amount), address: recipient },
    // outputs[1] = the remainder to be returned to a change address
    { value: sum - BigInt(amount) - BigInt(fee) },
  ];

  return {
    filteredUtxos,
    inputs: neededUtxos,
    outputs,
    size: sizeInfo.txVBytes,
    fee,
  };
}

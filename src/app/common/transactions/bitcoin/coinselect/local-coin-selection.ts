import BigNumber from 'bignumber.js';
import { validate } from 'bitcoin-address-validation';

import type { RpcSendTransferRecipient } from '@shared/rpc/methods/send-transfer';

import { sumNumbers } from '@app/common/math/helpers';
import { UtxoResponseItem } from '@app/query/bitcoin/bitcoin-client';

import {
  filterUneconomicalUtxos,
  filterUneconomicalUtxosMultipleRecipients,
  getBitcoinTxSizeEstimation,
  getSizeInfoMultipleRecipients,
} from '../utils';

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

  const sizeInfo = getBitcoinTxSizeEstimation({
    inputCount: filteredUtxos.length,
    outputCount: 1,
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

function getUtxoTotal(utxos: UtxoResponseItem[]) {
  return sumNumbers(utxos.map(utxo => utxo.value));
}

export function determineUtxosForSpend({
  amount,
  feeRate,
  recipient,
  utxos,
}: DetermineUtxosForSpendArgs) {
  if (!validate(recipient)) throw new Error('Cannot calculate spend of invalid address type');

  const filteredUtxos: UtxoResponseItem[] = filterUneconomicalUtxos({
    utxos: utxos.sort((a, b) => b.value - a.value),
    feeRate,
    address: recipient,
  });

  if (!filteredUtxos.length) throw new InsufficientFundsError();

  // Prepopulate with first UTXO, at least one is needed
  const neededUtxos: UtxoResponseItem[] = [filteredUtxos[0]];

  function estimateTransactionSize() {
    return getBitcoinTxSizeEstimation({
      inputCount: neededUtxos.length,
      outputCount: 2,
      recipient,
    });
  }

  function hasSufficientUtxosForTx() {
    const txEstimation = estimateTransactionSize();
    const neededAmount = new BigNumber(txEstimation.txVBytes * feeRate).plus(amount);
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

  const outputs = [
    // outputs[0] = the desired amount going to recipient
    { value: BigInt(amount), address: recipient },
    // outputs[1] = the remainder to be returned to a change address
    { value: BigInt(getUtxoTotal(neededUtxos).toString()) - BigInt(amount) - BigInt(fee) },
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

export interface DetermineUtxosForSpendArgsMultipleRecipients {
  amount: number;
  feeRate: number;
  recipients: RpcSendTransferRecipient[];
  utxos: UtxoResponseItem[];
}

interface DetermineUtxosForSpendAllArgsMultipleRecipients {
  feeRate: number;
  recipients: RpcSendTransferRecipient[];
  utxos: UtxoResponseItem[];
}

export function determineUtxosForSpendAllMultipleRecipients({
  feeRate,
  recipients,
  utxos,
}: DetermineUtxosForSpendAllArgsMultipleRecipients) {
  recipients.forEach(recipient => {
    if (!validate(recipient.address))
      throw new Error('Cannot calculate spend of invalid address type');
  });
  const filteredUtxos = filterUneconomicalUtxosMultipleRecipients({ utxos, feeRate, recipients });

  const sizeInfo = getSizeInfoMultipleRecipients({
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

export function determineUtxosForSpendMultipleRecipients({
  amount,
  feeRate,
  recipients,
  utxos,
}: DetermineUtxosForSpendArgsMultipleRecipients) {
  recipients.forEach(recipient => {
    if (!validate(recipient.address))
      throw new Error('Cannot calculate spend of invalid address type');
  });

  const orderedUtxos = utxos.sort((a, b) => b.value - a.value);

  const filteredUtxos = filterUneconomicalUtxosMultipleRecipients({
    utxos: orderedUtxos,
    feeRate,
    recipients,
  });

  const neededUtxos = [];
  let sum = 0n;
  let sizeInfo = null;

  for (const utxo of filteredUtxos) {
    sizeInfo = getSizeInfoMultipleRecipients({
      inputLength: neededUtxos.length,
      recipients,
    });
    if (sum >= BigInt(amount) + BigInt(Math.ceil(sizeInfo.txVBytes * feeRate))) break;

    sum += BigInt(utxo.value);
    neededUtxos.push(utxo);
  }

  if (!sizeInfo) throw new InsufficientFundsError();

  const fee = Math.ceil(sizeInfo.txVBytes * feeRate);

  const outputs: {
    value: bigint;
    address?: string;
  }[] = [
    // outputs[0] = the desired amount going to recipient
    ...recipients.map(({ address, amount }) => ({
      value: BigInt(amount.amount.toNumber()),
      address,
    })),
    // outputs[recipients.length] = the remainder to be returned to a change address
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

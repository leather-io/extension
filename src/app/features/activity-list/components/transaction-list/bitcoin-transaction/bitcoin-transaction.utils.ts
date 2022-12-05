import { truncateMiddle } from '@stacks/ui-utils';

import { BitcoinTransaction } from '@shared/models/transactions/bitcoin-transaction.model';

import { satToBtc } from '@app/common/money/unit-conversion';
import { sumNumbers } from '@app/common/utils';

export const getBitcoinTxCaption = (transaction?: BitcoinTransaction) =>
  transaction ? truncateMiddle(transaction.txid, 4) : '';

// If vin array contains a prevout with a scriptpubkey_address equal to
// the address, then that is the current address making a `Sent` tx (-)
// and the value of the prevout is the tx amount
const transactionsSentByAddress = (address: string, transaction: BitcoinTransaction) =>
  transaction.vin.filter(input => input.prevout.scriptpubkey_address === address);

// If vout array contains a scriptpubkey_address equal to the address,
// then that is a `Receive` tx (+) and the value is the tx amount
const transactionsReceivedByAddress = (address: string, transaction: BitcoinTransaction) =>
  transaction.vout.filter(output => output.scriptpubkey_address === address);

export function getBitcoinTxValue(address: string, transaction?: BitcoinTransaction) {
  if (!transaction) return '';
  const inputs = transactionsSentByAddress(address, transaction);
  const outputs = transactionsReceivedByAddress(address, transaction);
  const vinPrevoutValues = inputs.map(vin => vin.prevout.value);
  const voutValues = outputs.map(vout => vout.value);
  const totalInputValue = satToBtc(sumNumbers(vinPrevoutValues));
  const totalOutputValue = satToBtc(sumNumbers(voutValues));

  // This condition handles when change is sent back to the sender address
  const totalInputValueWithSubtractedOutputChange = totalInputValue.minus(totalOutputValue);
  if (inputs.length && outputs.length)
    return '-' + totalInputValueWithSubtractedOutputChange.toString();

  if (inputs.length) return '-' + totalInputValue.toString();
  if (outputs.length) return totalOutputValue.toString();
  return '';
}

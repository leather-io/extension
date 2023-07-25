import { truncateMiddle } from '@stacks/ui-utils';
import { getAddressInfo } from 'bitcoin-address-validation';

import { BitcoinTransactionVectorOutput } from '@shared/models/transactions/bitcoin-transaction.model';
import { BitcoinTx } from '@shared/models/transactions/bitcoin-transaction.model';

import { sumNumbers } from '@app/common/math/helpers';
import { satToBtc } from '@app/common/money/unit-conversion';

import { BtcSizeFeeEstimator } from './fees/btc-size-fee-estimator';

export function getSizeInfo(payload: {
  inputLength: number;
  recipient: string;
  outputLength: number;
}) {
  const { inputLength, recipient, outputLength } = payload;
  const addressInfo = getAddressInfo(recipient);

  const txSizer = new BtcSizeFeeEstimator();
  const sizeInfo = txSizer.calcTxSize({
    // Only p2wpkh is supported by the wallet
    input_script: 'p2wpkh',
    input_count: inputLength,
    // From the address of the recipient, we infer the output type
    [addressInfo.type + '_output_count']: outputLength,
  });

  return sizeInfo;
}

export function getRecipientAddressFromOutput(
  vout: BitcoinTransactionVectorOutput[],
  currentBitcoinAddress: string
) {
  return vout.find(output => output.scriptpubkey_address !== currentBitcoinAddress)
    ?.scriptpubkey_address;
}

export const getBitcoinTxCaption = (transaction?: BitcoinTx) =>
  transaction ? truncateMiddle(transaction.txid, 4) : '';

// If vin array contains a prevout with a scriptpubkey_address equal to
// the address, then that is the current address making a `Sent` tx (-)
// and the value of the prevout is the tx amount
const transactionsSentByAddress = (address: string, transaction: BitcoinTx) =>
  transaction.vin.filter(input => input.prevout.scriptpubkey_address === address);

// If vout array contains a scriptpubkey_address equal to the address,
// then that is a `Receive` tx (+) and the value is the tx amount
const transactionsReceivedByAddress = (address: string, transaction: BitcoinTx) =>
  transaction.vout.filter(output => output.scriptpubkey_address === address);

export function isBitcoinTxInbound(address: string, transaction: BitcoinTx) {
  const inputs = transactionsSentByAddress(address, transaction);
  const outputs = transactionsReceivedByAddress(address, transaction);

  if (inputs.length && outputs.length) return false;
  if (inputs.length) return false;
  return true;
}

export function getBitcoinTxValue(address: string, transaction?: BitcoinTx) {
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

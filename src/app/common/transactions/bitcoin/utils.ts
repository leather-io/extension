import BigNumber from 'bignumber.js';
import {
  type AddressInfo,
  AddressType,
  getAddressInfo,
  validate,
} from 'bitcoin-address-validation';

import { BTC_P2WPKH_DUST_AMOUNT } from '@leather.io/constants';
import type { BitcoinTransactionVectorOutput, BitcoinTx } from '@leather.io/models';
import type { UtxoResponseItem } from '@leather.io/query';
import { satToBtc, sumNumbers, truncateMiddle } from '@leather.io/utils';

import type { TransferRecipient } from '@shared/models/form.model';

import { BtcSizeFeeEstimator } from './fees/btc-size-fee-estimator';

export function containsTaprootInput(tx: BitcoinTx) {
  return tx.vin.some(input => input.prevout.scriptpubkey_type === 'v1_p2tr');
}

// Check if the spendable amount drops when adding a utxo. If it drops, don't use that utxo.
// Method might be not particularly efficient as it would
// go through the utxo array multiple times, but it's reliable.
export function filterUneconomicalUtxos({
  utxos,
  feeRate,
  recipients,
}: {
  utxos: UtxoResponseItem[];
  feeRate: number;
  recipients: TransferRecipient[];
}) {
  const { spendableAmount: fullSpendableAmount } = getSpendableAmount({
    utxos,
    feeRate,
    recipients,
  });

  const filteredUtxos = utxos
    .filter(utxo => utxo.value >= BTC_P2WPKH_DUST_AMOUNT)
    .filter(utxo => {
      // calculate spendableAmount without that utxo.
      const { spendableAmount } = getSpendableAmount({
        utxos: utxos.filter(u => u.txid !== utxo.txid),
        feeRate,
        recipients,
      });
      // if spendable amount becomes bigger, do not use that utxo
      return spendableAmount.toNumber() < fullSpendableAmount.toNumber();
    });
  return filteredUtxos;
}

export function getBitcoinTxSizeEstimation(payload: {
  inputCount: number;
  outputCount: number;
  recipient: string;
}) {
  const { inputCount, recipient, outputCount } = payload;
  const addressInfo = validate(recipient) ? getAddressInfo(recipient) : null;
  const outputAddressTypeWithFallback = addressInfo ? addressInfo.type : 'p2wpkh';

  const txSizer = new BtcSizeFeeEstimator();
  const sizeInfo = txSizer.calcTxSize({
    // Only p2wpkh is supported by the wallet
    input_script: 'p2wpkh',
    input_count: inputCount,
    // From the address of the recipient, we infer the output type
    [outputAddressTypeWithFallback + '_output_count']: outputCount,
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

interface GetSpendableAmountArgs {
  utxos: UtxoResponseItem[];
  feeRate: number;
  recipients: TransferRecipient[];
  isSendMax?: boolean;
}

export function getSpendableAmount({
  utxos,
  feeRate,
  recipients,
  isSendMax,
}: GetSpendableAmountArgs) {
  const balance = utxos.map(utxo => utxo.value).reduce((prevVal, curVal) => prevVal + curVal, 0);

  const size = getSizeInfo({
    inputLength: utxos.length,
    recipients,
    isSendMax,
  });
  const fee = Math.ceil(size.txVBytes * feeRate);
  const bigNumberBalance = BigNumber(balance);
  return {
    spendableAmount: BigNumber.max(0, bigNumberBalance.minus(fee)),
    fee,
  };
}

export function getSizeInfo(payload: {
  inputLength: number;
  recipients: TransferRecipient[];
  isSendMax?: boolean;
}) {
  const { inputLength, recipients, isSendMax } = payload;

  const validAddressesInfo = recipients
    .map(recipient => validate(recipient.address) && getAddressInfo(recipient.address))
    .filter(Boolean) as AddressInfo[];

  function getTxOutputsLengthByPaymentType() {
    return validAddressesInfo.reduce(
      (acc, { type }) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<AddressType, number>
    );
  }

  const outputTypesCount = getTxOutputsLengthByPaymentType();

  // If no outputs, e.g. when recipient is not provided, set default output to p2wpkh
  if (Object.values(outputTypesCount).length === 0) {
    outputTypesCount[AddressType.p2wpkh] = 1;
  }

  // Add a change address if not sending max (defaults to p2wpkh)
  if (!isSendMax) {
    outputTypesCount[AddressType.p2wpkh] = (outputTypesCount[AddressType.p2wpkh] || 0) + 1;
  }

  // Prepare the output data map for consumption by the txSizer
  const outputsData = Object.entries(outputTypesCount).reduce(
    (acc, [type, count]) => {
      acc[type + '_output_count'] = count;
      return acc;
    },
    {} as Record<string, number>
  );

  const txSizer = new BtcSizeFeeEstimator();
  const sizeInfo = txSizer.calcTxSize({
    input_script: 'p2wpkh',
    input_count: inputLength,
    ...outputsData,
  });

  return sizeInfo;
}

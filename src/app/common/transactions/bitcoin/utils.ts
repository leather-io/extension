import BigNumber from 'bignumber.js';
import { getAddressInfo, validate } from 'bitcoin-address-validation';

import { BTC_P2WPKH_DUST_AMOUNT } from '@shared/constants';
import {
  BitcoinTransactionVectorOutput,
  BitcoinTx,
} from '@shared/models/transactions/bitcoin-transaction.model';

import { sumNumbers } from '@app/common/math/helpers';
import { satToBtc } from '@app/common/money/unit-conversion';
import { UtxoResponseItem } from '@app/query/bitcoin/bitcoin-client';
import { truncateMiddle } from '@app/ui/utils/truncate-middle';

import { BtcSizeFeeEstimator } from './fees/btc-size-fee-estimator';

export function containsTaprootInput(tx: BitcoinTx) {
  return tx.vin.some(input => input.prevout.scriptpubkey_type === 'v1_p2tr');
}
export function getSpendableAmount({
  utxos,
  feeRate,
  address,
}: {
  utxos: UtxoResponseItem[];
  feeRate: number;
  address: string;
}) {
  const balance = utxos.map(utxo => utxo.value).reduce((prevVal, curVal) => prevVal + curVal, 0);

  const size = getSizeInfo({
    inputLength: utxos.length,
    outputLength: 1,
    recipient: address,
  });
  const fee = Math.ceil(size.txVBytes * feeRate);
  const bigNumberBalance = BigNumber(balance);
  return {
    spendableAmount: BigNumber.max(0, bigNumberBalance.minus(fee)),
    fee,
  };
}

// Check if the spendable amount drops when adding a utxo. If it drops, don't use that utxo.
// Method might be not particularly efficient as it would
// go through the utxo array multiple times, but it's reliable.
export function filterUneconomicalUtxos({
  utxos,
  feeRate,
  address,
}: {
  utxos: UtxoResponseItem[];
  feeRate: number;
  address: string;
}) {
  const { spendableAmount: fullSpendableAmount } = getSpendableAmount({
    utxos,
    feeRate,
    address,
  });

  const filteredUtxos = utxos
    .filter(utxo => utxo.value >= BTC_P2WPKH_DUST_AMOUNT)
    .filter(utxo => {
      // calculate spendableAmount without that utxo.
      const { spendableAmount } = getSpendableAmount({
        utxos: utxos.filter(u => u.txid !== utxo.txid),
        feeRate,
        address,
      });
      // if spendable amount becomes bigger, do not use that utxo
      return spendableAmount.toNumber() < fullSpendableAmount.toNumber();
    });
  return filteredUtxos;
}

export function getSizeInfo(payload: {
  inputLength: number;
  outputLength: number;
  recipient: string;
}) {
  const { inputLength, recipient, outputLength } = payload;
  const addressInfo = validate(recipient) ? getAddressInfo(recipient) : null;
  const outputAddressTypeWithFallback = addressInfo ? addressInfo.type : 'p2wpkh';

  const txSizer = new BtcSizeFeeEstimator();
  const sizeInfo = txSizer.calcTxSize({
    // Only p2wpkh is supported by the wallet
    input_script: 'p2wpkh',
    input_count: inputLength,
    // From the address of the recipient, we infer the output type
    [outputAddressTypeWithFallback + '_output_count']: outputLength,
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

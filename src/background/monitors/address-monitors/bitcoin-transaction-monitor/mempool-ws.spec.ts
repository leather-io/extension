import { describe, expect, it } from 'vitest';

import {
  type MempoolWsBitcoinTx,
  type MempoolWsBtcPrice,
  readMempooWsBtcPriceUsd,
  readMempoolWsBitcoinTxAddressResult,
} from './mempool-ws';

describe('readMempooWsBtcPriceUsd', () => {
  const mockMempoolWsBtcPrice: MempoolWsBtcPrice = {
    time: 1234567890,
    USD: 99000,
  };

  it('should return USD price as a number', () => {
    const price = readMempooWsBtcPriceUsd(mockMempoolWsBtcPrice);
    expect(price).toBe(99000);
  });
});

describe('readMempoolWsBitcoinTxAddressResult', () => {
  const senderAddress = 'bc1sender';
  const receiverAddress1 = 'bc1receiver';
  const receiverAddress2 = 'bc2receiver';
  const sentAmount = 1000000;
  const receivedAmount1 = 100000;
  const receivedAmount2 = 200000;
  const feeAmount = 10000;
  const blockHeight = 123456;

  const mockMempoolWsBitcoinTx: MempoolWsBitcoinTx = {
    txid: 'tx1',
    vin: [
      {
        txid: 'prevtx',
        prevout: {
          scriptpubkey_address: senderAddress,
          value: sentAmount,
        },
      },
    ],
    vout: [
      {
        scriptpubkey_address: senderAddress,
        value: sentAmount - receivedAmount1 - receivedAmount2 - feeAmount,
      },
      {
        scriptpubkey_address: receiverAddress1,
        value: receivedAmount1,
      },
      {
        scriptpubkey_address: receiverAddress2,
        value: receivedAmount2,
      },
    ],
    fee: feeAmount,
    status: {
      confirmed: true,
      block_height: blockHeight,
    },
  };

  it('identifies sender and calculates value as sum of vouts to non-sender addresses', () => {
    const result = readMempoolWsBitcoinTxAddressResult(senderAddress, mockMempoolWsBitcoinTx);
    expect(result.isSender).toEqual(true);
    expect(result.satValue).toEqual(receivedAmount1 + receivedAmount2);
  });

  it('identifies receiver and calculates value as of matching vout address', () => {
    const result1 = readMempoolWsBitcoinTxAddressResult(receiverAddress1, mockMempoolWsBitcoinTx);
    const result2 = readMempoolWsBitcoinTxAddressResult(receiverAddress2, mockMempoolWsBitcoinTx);
    expect(result1.isSender).toEqual(false);
    expect(result1.satValue).toEqual(receivedAmount1);
    expect(result2.isSender).toEqual(false);
    expect(result2.satValue).toEqual(receivedAmount2);
  });

  it('correctly reads the fee and block height', () => {
    const result = readMempoolWsBitcoinTxAddressResult(receiverAddress1, mockMempoolWsBitcoinTx);
    expect(result.fee).toEqual(feeAmount);
    expect(result.blockHeight).toEqual(blockHeight);
  });
});

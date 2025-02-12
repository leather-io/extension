import { sumNumbers } from '@leather.io/utils';

export interface MempoolWsBitcoinTxMessage {
  'multi-address-transactions': {
    [address: string]: {
      mempool: MempoolWsBitcoinTx[];
      confirmed: MempoolWsBitcoinTx[];
      removed: MempoolWsBitcoinTx[];
    };
  };
}

export interface MempoolWsBitcoinTx {
  txid: string;
  vin: MempoolWsBitcoinVin[];
  vout: MempoolWsBitcoinVout[];
  fee: number;
  status: {
    confirmed: boolean;
    block_height?: number;
  };
}

interface MempoolWsBitcoinVin {
  txid: string;
  prevout: MempoolWsBitcoinVout;
}

interface MempoolWsBitcoinVout {
  scriptpubkey_address: string;
  value: number;
}

export interface MempoolWsBtcPrice {
  time: number;
  USD: number;
}

export function readMempooWsBtcPriceUsd(mempoolWsPrice: MempoolWsBtcPrice) {
  return mempoolWsPrice.USD;
}

export function readMempoolWsBitcoinTxAddressResult(
  address: string,
  transaction: MempoolWsBitcoinTx
) {
  let satValue = 0;
  let isSender = false;

  const vin = transaction.vin.find(vin => vin.prevout.scriptpubkey_address === address);

  if (vin) {
    // address is sender, value is sum of all vouts not to same address
    isSender = true;
    satValue = sumNumbers(
      transaction.vout.filter(vout => vout.scriptpubkey_address !== address).map(vout => vout.value)
    ).toNumber();
  } else {
    const vout = transaction.vout.find(vout => vout.scriptpubkey_address === address);
    if (vout) {
      // address is receiver, value is in matching vout
      isSender = false;
      satValue = vout.value;
    }
  }
  return {
    isSender,
    satValue,
    fee: transaction.fee,
    blockHeight: transaction.status.block_height ?? 0,
  };
}

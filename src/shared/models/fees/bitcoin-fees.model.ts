import BigNumber from 'bignumber.js';

export interface AverageBitcoinFeeRates {
  fastestFee: BigNumber;
  halfHourFee: BigNumber;
  hourFee: BigNumber;
}

export const btcTxTimeMap: Record<keyof AverageBitcoinFeeRates, string> = {
  fastestFee: '~10 – 20min',
  halfHourFee: '~30 min',
  hourFee: '~1 hour+',
};

export enum BtcFeeType {
  High = 'High',
  Standard = 'Standard',
  Low = 'Low',
}

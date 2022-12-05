// Source: https://github.com/Blockstream/esplora/blob/master/API.md#fee-estimates
import { Money } from '../money.model';

// Returned as fee rates
export interface BitcoinFeeEstimates {
  '1': number;
  '2': number;
  '3': number;
  '4': number;
  '5': number;
  '6': number;
  '7': number;
  '8': number;
  '9': number;
  '10': number;
  '11': number;
  '12': number;
  '13': number;
  '14': number;
  '15': number;
  '16': number;
  '17': number;
  '18': number;
  '19': number;
  '20': number;
  '21': number;
  '22': number;
  '23': number;
  '24': number;
  '25': number;
  '144': number;
  '504': number;
  '1008': number;
}

export interface BitcoinFeeEstimate {
  fee: Money;
  feeRate: number;
}

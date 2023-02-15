// Source: https://github.com/Blockstream/esplora/blob/master/API.md#fee-estimates
import { Money } from '../money.model';

export interface BitcoinFeeEstimate {
  feeRate: number;
  fee: Money;
}

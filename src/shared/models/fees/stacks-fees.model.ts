import { Money } from '../money.model';

export interface StacksFeeEstimate {
  fee: Money;
  feeRate: number;
}

interface Estimation {
  fee: number;
  fee_rate: number;
}

export interface StacksTxFeeEstimation {
  cost_scalar_change_by_byte: number;
  estimated_cost: Object;
  estimated_cost_scalar: number;
  estimations: Estimation[];
  error: string;
}

import { Money } from '../money.model';

export interface StacksFeeEstimate {
  fee: Money;
  feeRate: number;
}

export interface ApiFeeEstimation {
  fee: number;
  fee_rate: number;
}

export interface StacksTxFeeEstimation {
  cost_scalar_change_by_byte: number;
  estimated_cost: object;
  estimated_cost_scalar: number;
  estimations: ApiFeeEstimation[];
  error?: string;
}

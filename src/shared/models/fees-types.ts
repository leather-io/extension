export enum Estimations {
  Low,
  Middle,
  High,
  Custom,
}

export interface FeeEstimation {
  fee: number;
  fee_rate: number;
}

export interface TransactionFeeEstimation {
  cost_scalar_change_by_byte: number;
  estimated_cost: Object;
  estimated_cost_scalar: number;
  estimations: FeeEstimation[];
  error: string; // Returned if bad request
}

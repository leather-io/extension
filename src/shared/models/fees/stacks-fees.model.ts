export interface StacksFeeEstimate {
  fee: number;
  feeRate: number;
}

export interface StacksTxFeeEstimation {
  cost_scalar_change_by_byte: number;
  estimated_cost: Object;
  estimated_cost_scalar: number;
  estimations: StacksFeeEstimate[];
  error: string; // Returned if bad request
}

export enum FeeType {
  Low,
  Middle,
  High,
  Custom,
}

export enum FeeCalculationType {
  Api = 'api',
  Default = 'default',
  DefaultSimulated = 'default-simulated',
  FeesCapped = 'fees-capped',
}

export interface FeeEstimation {
  estimates: FeeEstimate[];
  calculation: FeeCalculationType;
}

export interface FeeEstimate {
  fee: number;
  fee_rate: number;
}

export interface TransactionFeeEstimation {
  cost_scalar_change_by_byte: number;
  estimated_cost: Object;
  estimated_cost_scalar: number;
  estimations: FeeEstimate[];
  error: string; // Returned if bad request
}

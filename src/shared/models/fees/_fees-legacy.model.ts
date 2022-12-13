/*
  This file is being kept to handle the legacy send form (pre-bitcoin).
  It should be removed with the legacy send form.
*/
import { Blockchains } from '../blockchain.model';
import { FeeCalculationTypes } from './_fees.model';

export interface StacksFeeEstimateLegacy {
  fee: number;
  feeRate: number;
}

export interface StacksTxFeeEstimationLegacy {
  cost_scalar_change_by_byte: number;
  estimated_cost: Object;
  estimated_cost_scalar: number;
  estimations: StacksFeeEstimateLegacy[];
  error: string;
}

export interface FeesLegacy {
  blockchain: Blockchains;
  estimates: StacksFeeEstimateLegacy[];
  calculation: FeeCalculationTypes;
}

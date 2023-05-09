import { Blockchains } from '../blockchain.model';
import { StacksFeeEstimate } from './stacks-fees.model';

export enum FeeTypes {
  Low,
  Middle,
  High,
  Custom,
  Unknown,
}

export enum FeeCalculationTypes {
  Api = 'api',
  Default = 'default',
  DefaultSimulated = 'default-simulated',
  FeesCapped = 'fees-capped',
}

export interface Fees {
  blockchain: Blockchains;
  estimates: StacksFeeEstimate[];
  calculation: FeeCalculationTypes;
}

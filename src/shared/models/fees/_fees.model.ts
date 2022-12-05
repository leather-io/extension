import { Blockchains } from '../blockchain.model';
import { BitcoinFeeEstimate } from './bitcoin-fees.model';
import { StacksFeeEstimate } from './stacks-fees.model';

export enum FeeTypes {
  Low,
  Middle,
  High,
  Custom,
}

export enum FeeCalculationTypes {
  Api = 'api',
  Default = 'default',
  DefaultSimulated = 'default-simulated',
  FeesCapped = 'fees-capped',
}

export interface FeeEstimations {
  blockchain: Blockchains;
  estimates: BitcoinFeeEstimate[] | StacksFeeEstimate[];
  calculation: FeeCalculationTypes;
}

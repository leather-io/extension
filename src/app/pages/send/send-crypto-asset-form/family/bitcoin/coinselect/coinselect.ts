// @ts-ignore
import coinselection from 'coinselect';

export interface Input {
  txid: string;
  vout: number;
  status: {
    confirmed: boolean;
    block_height: number;
    block_hash: string;
    block_time: number;
  };
  value: number;
}

export interface Output {
  address?: string;
  value: number;
}

export const coinselect = coinselection as (
  utxos: Input[],
  outputs: Output[],
  feeRate: number
) => { inputs: Input[]; outputs: Output[]; fee: number };

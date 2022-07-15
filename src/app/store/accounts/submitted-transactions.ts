import { atom } from 'jotai';

export interface SubmittedTransaction {
  rawTx: string;
  txid: string;
}

export const accountSubmittedTransactionsState = atom<SubmittedTransaction[]>([]);

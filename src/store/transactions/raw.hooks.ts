import {
  rawStacksTransactionByteSizeState,
  rawStacksTransactionState,
  rawTxIdState,
  rawTxState,
} from '@store/transactions/raw';
import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';

export function useRawTxIdState() {
  return useAtom(rawTxIdState);
}

export function useRawTxState() {
  return useAtomValue(rawTxState);
}

export function useRawStacksTransactionState() {
  return useAtomValue(rawStacksTransactionState);
}
export function useRawStacksTransactionByteSizeState() {
  return useAtomValue(rawStacksTransactionByteSizeState);
}

import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';

import {
  rawTxByteLengthState,
  rawDeserializedTxState,
  rawTxIdState,
} from '@store/transactions/raw';

export function useRawTxIdState() {
  return useAtom(rawTxIdState);
}

export function useRawDeserializedTxState() {
  return useAtomValue(rawDeserializedTxState);
}

export function useRawTxByteLengthState() {
  return useAtomValue(rawTxByteLengthState);
}

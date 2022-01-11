import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';

import { rawDeserializedTxState, rawTxIdState } from '@store/transactions/raw';

export function useRawTxIdState() {
  return useAtom(rawTxIdState);
}

export function useRawDeserializedTxState() {
  return useAtomValue(rawDeserializedTxState);
}

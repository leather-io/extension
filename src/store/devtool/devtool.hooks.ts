import { useAtomValue } from 'jotai/utils';
import { queryClientAtom } from 'jotai-query-toolkit';

export function useClientQuery() {
  return useAtomValue(queryClientAtom);
}

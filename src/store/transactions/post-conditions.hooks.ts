import { postConditionModeState } from '@store/transactions/post-conditions';
import { useAtomValue } from 'jotai/utils';

export const usePostConditionModeState = () => {
  return useAtomValue(postConditionModeState);
};

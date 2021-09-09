import { useAtomValue } from 'jotai/utils';
import { apiClientState } from '@store/common/api-clients';

export function useAccountsApi() {
  return useAtomValue(apiClientState);
}

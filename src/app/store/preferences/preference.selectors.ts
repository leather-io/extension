import { useSelector } from 'react-redux';

import type { RootState } from '@app/store';

export function useDefaultPreferences() {
  return useSelector((state: RootState) => state.preferences);
}

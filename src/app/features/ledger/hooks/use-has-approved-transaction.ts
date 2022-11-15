import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import get from 'lodash.get';

export function useHasApprovedOperation() {
  const location = useLocation();

  return useMemo(() => {
    const state = location.state;
    return get(state, 'hasApprovedOperation', false) as boolean;
  }, [location.state]);
}

import { useLocation } from 'react-router-dom';

import get from 'lodash.get';

export function useStacksFtRouteState() {
  const location = useLocation();
  return { contractId: get(location.state, 'contractId') };
}

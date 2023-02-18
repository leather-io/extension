import { useLocation } from 'react-router-dom';

import get from 'lodash.get';

export function useSendFormRouteState() {
  const { state } = useLocation();
  return {
    amount: get(state, 'amount', ''),
    recipient: get(state, 'recipient', ''),
    ...state,
  };
}

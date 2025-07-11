import { useLocation } from 'react-router';

import get from 'lodash.get';

export function useSendFormRouteState() {
  const { state } = useLocation();
  return {
    amount: get(state, 'amount', ''),
    recipient: get(state, 'recipient', ''),
    ...state,
  };
}

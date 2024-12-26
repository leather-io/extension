import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { replaceRouteParams } from '@shared/utils/replace-route-params';

export function useSwapNavigate() {
  const { base, quote } = useParams();
  const navigate = useNavigate();

  return useCallback(
    (route: string) => {
      navigate(
        replaceRouteParams(route, {
          base: base ?? '',
          quote: quote ?? '',
        })
      );
    },
    [base, navigate, quote]
  );
}

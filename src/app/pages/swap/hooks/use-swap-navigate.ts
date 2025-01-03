import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function useSwapNavigate() {
  const navigate = useNavigate();
  const { base, quote } = useParams();

  return useCallback(
    (route: string) => {
      navigate(route.replace(':base', base ?? '').replace(':quote', quote ?? ''));
    },
    [base, navigate, quote]
  );
}

import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function useSwapNavigate() {
  const navigate = useNavigate();
  const { base, quote } = useParams();

  const origin = 'bitcoin'; // read this from context

  return useCallback(
    (route: string) => {
      navigate(
        route
          .replace(':origin', origin ?? '')
          .replace(':base', base ?? '')
          .replace(':quote', quote ?? '')
      );
    },
    [base, navigate, quote]
  );
}

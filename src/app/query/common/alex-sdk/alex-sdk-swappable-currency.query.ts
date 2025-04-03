import { useQuery } from '@tanstack/react-query';

import { createGetAlexSwappableCurrenciesQueryOptions } from '@leather.io/query';

export function useGetAlexSwappableCurrenciesQuery() {
  return useQuery(createGetAlexSwappableCurrenciesQueryOptions());
}

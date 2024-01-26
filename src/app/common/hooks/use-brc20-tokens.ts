import { useGetBrc20TokensQuery } from '@app/query/bitcoin/ordinals/brc20/brc20-tokens.query';

export function useBrc20Tokens() {
  const { data: allBrc20TokensResponse } = useGetBrc20TokensQuery();
  const brc20Tokens = allBrc20TokensResponse?.pages
    .flatMap(page => page.brc20Tokens)
    .filter(token => token.length > 0)
    .flatMap(token => token);

  return brc20Tokens;
}

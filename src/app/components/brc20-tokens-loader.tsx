import {
  Brc20Token,
  useBrc20TokensQuery,
} from '@app/query/bitcoin/ordinals/brc20/brc20-tokens.query';

interface Brc20TokensLoaderProps {
  children(brc20Tokens: Brc20Token[]): React.JSX.Element;
}
export function Brc20TokensLoader({ children }: Brc20TokensLoaderProps) {
  const { data: allBrc20TokensResponse } = useBrc20TokensQuery();
  const brc20Tokens = allBrc20TokensResponse?.pages
    .flatMap(page => page.brc20Tokens)
    .filter(token => token.length > 0)
    .flatMap(token => token);

  if (!brc20Tokens) return null;
  return children(brc20Tokens);
}

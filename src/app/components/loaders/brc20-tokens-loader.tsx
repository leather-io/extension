import { Brc20Token } from '@app/query/bitcoin/bitcoin-client';
import { useBrc20Tokens } from '@app/query/bitcoin/ordinals/brc20/brc20-tokens.hooks';

interface Brc20TokensLoaderProps {
  children(brc20Tokens: Brc20Token[]): React.ReactNode;
}
export function Brc20TokensLoader({ children }: Brc20TokensLoaderProps) {
  const brc20Tokens = useBrc20Tokens();
  return children(brc20Tokens);
}

import { useBrc20Tokens } from '@app/common/hooks/use-brc20-tokens';
import { Brc20Token } from '@app/query/bitcoin/bitcoin-client';

interface Brc20TokensLoaderProps {
  children(brc20Tokens: Brc20Token[]): React.ReactNode;
}
export function Brc20TokensLoader({ children }: Brc20TokensLoaderProps) {
  const brc20Tokens = useBrc20Tokens();
  return children(brc20Tokens);
}

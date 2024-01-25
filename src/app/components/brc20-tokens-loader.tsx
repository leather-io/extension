import { useBrc20Tokens } from '@app/common/hooks/use-brc20-tokens';
import { Brc20Token } from '@app/query/bitcoin/ordinals/brc20/brc20-tokens.query';

interface Brc20TokensLoaderProps {
  children(brc20Tokens: Brc20Token[]): React.JSX.Element;
}

export function Brc20TokensLoader({ children }: Brc20TokensLoaderProps) {
  const brc20Tokens = useBrc20Tokens();

  if (!brc20Tokens) return null;
  return children(brc20Tokens);
}

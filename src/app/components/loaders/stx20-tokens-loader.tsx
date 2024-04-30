import type { Stx20Token } from '@app/query/stacks/stacks-client';
import { useStx20Tokens } from '@app/query/stacks/stx20/stx20-tokens.hooks';

interface Stx20TokensLoaderProps {
  address: string;
  children(tokens: Stx20Token[]): React.ReactNode;
}
export function Stx20TokensLoader({ address, children }: Stx20TokensLoaderProps) {
  const { data: tokens = [] } = useStx20Tokens(address);
  return children(tokens);
}

import type { Stx20Token } from '@app/api/stacks/types/stx20-types';
import { useStx20Tokens } from '@app/query/stacks/stx20/stx20-tokens.hooks';

interface Stx20TokensLoaderProps {
  address: string;
  children(runes: Stx20Token[]): React.ReactNode;
}
export function Stx20TokensLoader({ address, children }: Stx20TokensLoaderProps) {
  const { data: stx20Tokens = [] } = useStx20Tokens(address);
  return children(stx20Tokens);
}

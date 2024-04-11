import type { RuneToken } from '@app/query/bitcoin/bitcoin-client';
import { useRuneTokens } from '@app/query/bitcoin/runes/runes.hooks';

interface RunesLoaderProps {
  address: string;
  children(runes: RuneToken[]): React.ReactNode;
}
export function RunesLoader({ address, children }: RunesLoaderProps) {
  const { data: runes = [] } = useRuneTokens(address);
  return children(runes);
}

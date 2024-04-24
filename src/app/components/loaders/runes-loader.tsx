import type { RuneToken } from '@app/query/bitcoin/bitcoin-client';
import { useRuneTokens } from '@app/query/bitcoin/runes/runes.hooks';

interface RunesLoaderProps {
  addresses: string[];
  children(runes: RuneToken[]): React.ReactNode;
}
export function RunesLoader({ addresses, children }: RunesLoaderProps) {
  const runes = useRuneTokens(addresses);
  return children(runes);
}

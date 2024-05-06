import { type RuneToken, useRuneTokens } from '@leather-wallet/query';

interface RunesLoaderProps {
  addresses: string[];
  children(runes: RuneToken[]): React.ReactNode;
}
export function RunesLoader({ addresses, children }: RunesLoaderProps) {
  const runes = useRuneTokens(addresses);
  return children(runes);
}

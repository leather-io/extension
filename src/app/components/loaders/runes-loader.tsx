import { useRuneTokens } from '@leather-wallet/query';

import type { RuneToken } from '@app/query/bitcoin/bitcoin-client';

interface RunesLoaderProps {
  addresses: string[];
  children(runes: RuneToken[]): React.ReactNode;
}
export function RunesLoader({ addresses, children }: RunesLoaderProps) {
  const runes = useRuneTokens(addresses);
  return children(runes);
}

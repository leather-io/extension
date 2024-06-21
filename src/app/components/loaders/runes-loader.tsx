import type { CryptoAssetBalance, RuneCryptoAssetInfo } from '@leather.io/models';
import { useRuneTokens } from '@leather.io/query';

interface RunesLoaderProps {
  addresses: string[];
  children(runes: { balance: CryptoAssetBalance; info: RuneCryptoAssetInfo }[]): React.ReactNode;
}
export function RunesLoader({ addresses, children }: RunesLoaderProps) {
  const { runes = [] } = useRuneTokens(addresses);
  return children(runes);
}

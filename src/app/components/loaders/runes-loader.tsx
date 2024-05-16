import type { CryptoAssetBalance, RuneCryptoAssetInfo } from '@leather-wallet/models';

import { useRuneTokens } from '@app/query/bitcoin/runes/runes.hooks';

interface RunesLoaderProps {
  addresses: string[];
  children(runes: { balance: CryptoAssetBalance; info: RuneCryptoAssetInfo }[]): React.ReactNode;
}
export function RunesLoader({ addresses, children }: RunesLoaderProps) {
  const { runes = [] } = useRuneTokens(addresses);
  return children(runes);
}

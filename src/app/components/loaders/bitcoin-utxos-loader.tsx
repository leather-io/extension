import type { UtxoResponseItem } from '@leather.io/query';

import { useOnMount } from '@app/common/hooks/use-on-mount';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';

interface BitcoinUtxosLoaderProps {
  children(utxos: UtxoResponseItem[]): React.ReactNode;
}
export function BitcoinUtxosLoader({ children }: BitcoinUtxosLoaderProps) {
  const { data: utxos = [], filteredUtxosQuery } = useCurrentNativeSegwitUtxos();
  // Forcing a refetch to ensure UTXOs are fresh
  useOnMount(() => filteredUtxosQuery.refetch());
  return children(utxos);
}

import type { UtxoResponseItem } from '@leather.io/query';

import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';

interface BitcoinUtxosLoaderProps {
  children(utxos: UtxoResponseItem[]): React.ReactNode;
}
export function BitcoinUtxosLoader({ children }: BitcoinUtxosLoaderProps) {
  const { data: utxos = [] } = useCurrentNativeSegwitUtxos();
  return children(utxos);
}

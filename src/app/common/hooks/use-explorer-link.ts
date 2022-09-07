import { useCallback } from 'react';

import { makeTxExplorerLink } from '@app/common/utils';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

export function useExplorerLink() {
  const { mode } = useCurrentNetworkState();
  const handleOpenTxLink = useCallback(
    (txid: string, suffix?: string) =>
      window.open(makeTxExplorerLink(txid, mode, suffix), '_blank'),
    [mode]
  );

  return {
    handleOpenTxLink,
  };
}

import { useCallback } from 'react';
import { makeTxExplorerLink } from '@common/utils';
import { useCurrentNetwork } from '@common/hooks/use-current-network';

export function useExplorerLink() {
  const { mode } = useCurrentNetwork();
  const handleOpenTxLink = useCallback(
    (txid: string, suffix?: string) =>
      window.open(makeTxExplorerLink(txid, mode, suffix), '_blank'),
    [mode]
  );

  return {
    handleOpenTxLink,
  };
}

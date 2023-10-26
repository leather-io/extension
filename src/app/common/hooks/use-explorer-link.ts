import { useCallback } from 'react';

import type { Blockchains } from '@shared/models/blockchain.model';

import { makeTxExplorerLink } from '@app/common/utils';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { openInNewTab } from '../utils/open-in-new-tab';

export interface HandleOpenTxLinkArgs {
  blockchain: Blockchains;
  suffix?: string;
  txId: string;
}
export function useExplorerLink() {
  const { mode } = useCurrentNetworkState();
  const handleOpenTxLink = useCallback(
    ({ blockchain, suffix, txId }: HandleOpenTxLinkArgs) =>
      openInNewTab(makeTxExplorerLink({ blockchain, mode, suffix, txId })),
    [mode]
  );

  return {
    handleOpenTxLink,
  };
}

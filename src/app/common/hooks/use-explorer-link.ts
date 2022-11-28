import { useCallback } from 'react';

import type { Blockchains } from '@shared/models/blockchain.model';

import { makeTxExplorerLink } from '@app/common/utils';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { openInNewTab } from '../utils/open-in-new-tab';

interface HandleOpenTxLinkArgs {
  blockchain: Blockchains;
  suffix?: string;
  txid: string;
}
export function useExplorerLink() {
  const { mode } = useCurrentNetworkState();
  const handleOpenTxLink = useCallback(
    ({ blockchain, suffix, txid }: HandleOpenTxLinkArgs) =>
      openInNewTab(makeTxExplorerLink({ blockchain, mode, suffix, txid })),
    [mode]
  );

  return {
    handleOpenTxLink,
  };
}

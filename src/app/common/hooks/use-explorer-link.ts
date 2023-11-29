import { useCallback } from 'react';

import type { Blockchains } from '@shared/models/blockchain.model';

import { makeTxExplorerLink } from '@app/common/utils';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { openInNewTab } from '../utils/open-in-new-tab';

export interface HandleOpenTxLinkArgs {
  blockchain: Blockchains;
  suffix?: string;
  txid: string;
}
export function useExplorerLink() {
  const { mode, chain } = useCurrentNetworkState();
  const { bitcoin } = chain;
  const handleOpenTxLink = useCallback(
    ({ blockchain, suffix, txid }: HandleOpenTxLinkArgs) => {
      openInNewTab(makeTxExplorerLink({ blockchain, mode, suffix, txid, bitcoin }));
    },
    [mode, bitcoin]
  );

  return {
    handleOpenTxLink,
  };
}

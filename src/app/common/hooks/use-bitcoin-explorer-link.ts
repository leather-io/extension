import { useCallback } from 'react';

import { makeBitcoinTxExplorerLink } from '@app/common/utils';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { openInNewTab } from '../utils/open-in-new-tab';

interface HandleOpenBitcoinTxLinkArgs {
  txid: string;
}

export function useBitcoinExplorerLink() {
  const { chain } = useCurrentNetworkState();
  const { bitcoin } = chain;
  const handleOpenBitcoinTxLink = useCallback(
    ({ txid }: HandleOpenBitcoinTxLinkArgs) => {
      openInNewTab(makeBitcoinTxExplorerLink({ txid, bitcoin }));
    },
    [bitcoin]
  );

  return {
    handleOpenBitcoinTxLink,
  };
}

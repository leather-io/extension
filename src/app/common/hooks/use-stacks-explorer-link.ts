import { useCallback } from 'react';

import { makeStacksTxExplorerLink } from '@app/common/utils';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { openInNewTab } from '../utils/open-in-new-tab';

interface HandleOpenStacksTxLinkArgs {
  searchParams?: URLSearchParams;
  txid: string;
}
export function useStacksExplorerLink() {
  const { chain, isNakamotoTestnet } = useCurrentNetworkState();

  const handleOpenStacksTxLink = useCallback(
    ({ searchParams, txid }: HandleOpenStacksTxLinkArgs) => {
      openInNewTab(
        makeStacksTxExplorerLink({
          mode: chain.bitcoin.mode,
          searchParams,
          isNakamoto: isNakamotoTestnet,
          txid,
        })
      );
    },
    [chain.bitcoin.mode, isNakamotoTestnet]
  );

  return { handleOpenStacksTxLink };
}

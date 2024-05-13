import { useCallback } from 'react';

import { makeStacksTxExplorerLink } from '@app/common/utils';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { openInNewTab } from '../utils/open-in-new-tab';

export interface HandleOpenStacksTxLinkArgs {
  searchParams?: URLSearchParams;
  txid: string;
}
export function useStacksExplorerLink() {
  const { mode, isNakamotoTestnet } = useCurrentNetworkState();

  const handleOpenStacksTxLink = useCallback(
    ({ searchParams, txid }: HandleOpenStacksTxLinkArgs) => {
      openInNewTab(
        makeStacksTxExplorerLink({ mode, searchParams, isNakamoto: isNakamotoTestnet, txid })
      );
    },
    [mode, isNakamotoTestnet]
  );

  return {
    handleOpenStacksTxLink,
  };
}

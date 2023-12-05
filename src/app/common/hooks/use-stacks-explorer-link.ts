import { useCallback } from 'react';

import { makeStacksTxExplorerLink } from '@app/common/utils';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { openInNewTab } from '../utils/open-in-new-tab';

export interface HandleOpenStacksTxLinkArgs {
  suffix?: string;
  txid: string;
}
export function useStacksExplorerLink() {
  const { mode } = useCurrentNetworkState();

  const handleOpenStacksTxLink = useCallback(
    ({ suffix, txid }: HandleOpenStacksTxLinkArgs) => {
      openInNewTab(makeStacksTxExplorerLink({ mode, suffix, txid }));
    },
    [mode]
  );

  return {
    handleOpenStacksTxLink,
  };
}

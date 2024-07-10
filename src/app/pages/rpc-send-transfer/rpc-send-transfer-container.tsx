import { useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import { Flex } from 'leather-styles/jsx';

import type { BtcFeeType } from '@leather.io/models';

import { closeWindow } from '@shared/utils';

import { PopupHeader } from '@app/features/container/headers/popup.header';

import { useRpcSendTransfer } from './use-rpc-send-transfer';

interface RpcSendTransferContextState {
  selectedFeeType: BtcFeeType;
  setSelectedFeeType(value: BtcFeeType | null): void;
}
export function useRpcSendTransferState() {
  const context = useOutletContext<RpcSendTransferContextState>();
  return { ...context };
}

export function RpcSendTransferContainer() {
  const [selectedFeeType, setSelectedFeeType] = useState<BtcFeeType | null>(null);
  const { origin } = useRpcSendTransfer();

  if (origin === null) {
    closeWindow();
    throw new Error('Origin is null');
  }

  return (
    <>
      <PopupHeader showSwitchAccount balance="all" />
      <Flex alignItems="center" flexDirection="column" p="space.05" width="100%">
        <Outlet context={{ selectedFeeType, setSelectedFeeType }} />
      </Flex>
    </>
  );
}

import { useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import type { BtcFeeType } from '@leather-wallet/models';

import { closeWindow } from '@shared/utils';

import { RpcSendTransferContainerLayout } from './components/rpc-send-transfer-container.layout';
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
    <RpcSendTransferContainerLayout>
      <Outlet context={{ selectedFeeType, setSelectedFeeType }} />
    </RpcSendTransferContainerLayout>
  );
}

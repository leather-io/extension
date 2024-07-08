import { useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import type { BtcFeeType } from '@leather.io/models';

import { useUpdatePageHeaderContext } from '@app/features/container/containers/page/page.context';

interface SendBitcoinAssetContextState {
  selectedFeeType: BtcFeeType | null;
  setSelectedFeeType(value: BtcFeeType | null): void;
}
export function useSendBitcoinAssetContextState() {
  const context = useOutletContext<SendBitcoinAssetContextState>();
  return { ...context };
}

export function SendBitcoinAssetContainer() {
  useUpdatePageHeaderContext({ title: 'Send' });
  const [selectedFeeType, setSelectedFeeType] = useState<BtcFeeType | null>(null);
  return <Outlet context={{ selectedFeeType, setSelectedFeeType }} />;
}

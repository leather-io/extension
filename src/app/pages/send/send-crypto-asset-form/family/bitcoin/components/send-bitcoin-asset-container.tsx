import { useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import type { BtcFeeType } from '@leather.io/models';

interface SendBitcoinAssetContextState {
  selectedFeeType: BtcFeeType | null;
  setSelectedFeeType(value: BtcFeeType | null): void;
}
export function useSendBitcoinAssetContextState() {
  const context = useOutletContext<SendBitcoinAssetContextState>();
  return { ...context };
}

export function SendBitcoinAssetContainer() {
  const [selectedFeeType, setSelectedFeeType] = useState<BtcFeeType | null>(null);
  return <Outlet context={{ selectedFeeType, setSelectedFeeType }} />;
}

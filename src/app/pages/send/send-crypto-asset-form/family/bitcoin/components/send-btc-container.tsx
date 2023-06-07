import { useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import { BtcFeeType } from '@shared/models/fees/bitcoin-fees.model';

interface SendBtcContextState {
  selectedFeeType: BtcFeeType | null;
  setSelectedFeeType(value: BtcFeeType | null): void;
}
export function useSendBtcState() {
  const context = useOutletContext<SendBtcContextState>();
  return { ...context };
}

export function SendBtcContainer() {
  const [selectedFeeType, setSelectedFeeType] = useState(null);
  return <Outlet context={{ selectedFeeType, setSelectedFeeType }} />;
}

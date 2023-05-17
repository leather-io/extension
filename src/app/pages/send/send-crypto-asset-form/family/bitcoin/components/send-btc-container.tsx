import { useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import { BtcFeeType } from '@shared/models/fees/bitcoin-fees.model';

interface SendBtcContextState {
  selectedFeeType: BtcFeeType;
  setSelectedFeeType(value: BtcFeeType): void;
}
export function useSendBtcState() {
  const context = useOutletContext<SendBtcContextState>();
  return { ...context };
}

export function SendBtcContainer() {
  const [selectedFeeType, setSelectedFeeType] = useState(BtcFeeType.Low);
  return <Outlet context={{ selectedFeeType, setSelectedFeeType }} />;
}

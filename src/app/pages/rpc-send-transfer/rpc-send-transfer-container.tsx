import { Outlet, useOutletContext } from 'react-router-dom';

import type { Money } from '@leather.io/models';
import { type UtxoResponseItem } from '@leather.io/query';

import type { TransferRecipient } from '@shared/models/form.model';
import { closeWindow } from '@shared/utils';

import { type FeeDisplayInfo, type FeeType, useFeesHandler } from '@app/common/fees/use-fees';
import { useSwitchAccountSheet } from '@app/common/switch-account/use-switch-account-sheet-context';
import {
  type FeesRawData,
  type RawFee,
  useBitcoinFeeData,
} from '@app/components/bitcoin-fees-list/use-bitcoin-fees-data';

import { useRpcSendTransfer } from './use-rpc-send-transfer';

interface RpcSendTransferContextState {
  selectedFeeType: FeeType;
  setSelectedFeeType(value: FeeType | null): void;

  availableBalance: number;
  recipients: TransferRecipient[];
  totalAmount: number;
  amountAsMoney: Money;
  recipientsAddresses: string[];
  utxos: UtxoResponseItem[];
  onChooseTransferFee(): void;
  fees: FeesRawData;
  getCustomFeeData(rate: number): RawFee;
  formatFeeForDisplay(rawFee: RawFee): FeeDisplayInfo;

  origin: string;
  selectedFeeData: FeeDisplayInfo;

  editFeeSelected: FeeType;
  setEditFeeSelected(value: FeeType): void;

  customFeeRate: string;
  setCustomFeeRate(value: string | null): void;

  customFeeData: FeeDisplayInfo | null;

  isLoadingFees: boolean;

  tabId: number | null;
  requestId: string;
  toggleSwitchAccount(): void;
}

export function useRpcSendTransferState() {
  const context = useOutletContext<RpcSendTransferContextState>();
  return { ...context };
}

export function RpcSendTransferContainer() {
  const sendTransferState = useRpcSendTransfer();
  const { toggleSwitchAccount } = useSwitchAccountSheet();

  if (sendTransferState.origin === null) {
    closeWindow();
    throw new Error('Origin is null');
  }
  const { recipients, utxos, amountAsMoney } = sendTransferState;

  const {
    fees,
    getCustomFeeData,
    formatFeeForDisplay,
    isLoading: isLoadingFees,
  } = useBitcoinFeeData({
    amount: amountAsMoney,
    recipients,
    utxos,
  });

  const {
    selectedFeeType,
    setSelectedFeeType,
    customFeeRate,
    setCustomFeeRate,
    customFeeData,
    selectedFeeData,
    editFeeSelected,
    setEditFeeSelected,
  } = useFeesHandler({
    defaultFeeType: 'standard',
    fees,
    getCustomFeeData,
    formatFeeForDisplay,
  });

  return (
    <Outlet
      context={{
        toggleSwitchAccount,
        selectedFeeType,
        setSelectedFeeType,
        selectedFeeData,
        editFeeSelected,
        setEditFeeSelected,
        customFeeRate,
        setCustomFeeRate,
        customFeeData,
        isLoadingFees,
        getCustomFeeData,
        formatFeeForDisplay,
        fees,
        ...sendTransferState,
      }}
    />
  );
}

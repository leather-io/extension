import { Outlet, useOutletContext } from 'react-router-dom';

import type { Money } from '@leather.io/models';
import { type UtxoResponseItem, useCryptoCurrencyMarketDataMeanAverage } from '@leather.io/query';

import type { TransferRecipient } from '@shared/models/form.model';
import { closeWindow } from '@shared/utils';

import {
  type FeeDisplayInfo,
  type FeeType,
  type FeesRawData,
  useFeesHandler,
} from '@app/common/fees/use-fees';
import { useSwitchAccountSheet } from '@app/common/switch-account/use-switch-account-sheet-context';
import { type RawFee } from '@app/components/bitcoin-fees-list/bitcoin-fees.utils';
import { formatBitcoinFeeForDisplay } from '@app/components/bitcoin-fees-list/format-bitcoin-fee';
import { useBitcoinFeeData } from '@app/components/bitcoin-fees-list/use-bitcoin-fees-data';

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
  const context: RpcSendTransferContextState = useOutletContext<RpcSendTransferContextState>();
  return { ...context };
}

export function RpcSendTransferContainer() {
  const sendTransferState = useRpcSendTransfer();
  const { toggleSwitchAccount } = useSwitchAccountSheet();
  const btcMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');

  if (sendTransferState.origin === null) {
    closeWindow();
    throw new Error('Origin is null');
  }
  const { recipients, utxos, amountAsMoney } = sendTransferState;

  const {
    fees,
    getCustomFeeData,
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
    marketData: btcMarketData,
    formatFeeForDisplay: formatBitcoinFeeForDisplay,
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
        fees,
        ...sendTransferState,
      }}
    />
  );
}

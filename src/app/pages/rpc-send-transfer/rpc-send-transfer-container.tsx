import { useEffect, useMemo, useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import { motion, useAnimationControls } from 'framer-motion';
import { Box, Flex } from 'leather-styles/jsx';

import type { BtcFeeType, Money } from '@leather.io/models';
import type { Utxo, UtxoResponseItem } from '@leather.io/query';
import { LeatherLogomarkIcon } from '@leather.io/ui';

import type { TransferRecipient } from '@shared/models/form.model';
import { closeWindow } from '@shared/utils';

import { useBitcoinFeesList } from '@app/components/bitcoin-fees-list/use-bitcoin-fees-list-multiple-recipients';
import { FaviconDisplayer } from '@app/components/favicon-displayer/favicon-displayer';
import { PopupHeader } from '@app/features/container/headers/popup.header';

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
  approverFeesList: Fee[];
  origin: string;
  selectedFeeData: Fee;

  editFeeSelected: FeeType;
  setEditFeeSelected(value: FeeType): void;

  customFeeRate: string | null;
  setCustomFeeRate(value: string | null): void;

  customFeeData: Fee | null;
}

export type FeeType = 'slow' | 'standard' | 'fast' | 'custom';

export interface Fee {
  feeType: FeeType;
  baseUnitsValue: number;
  feeRate: number;
  titleLeft: string;
  captionLeft: string;
  titleRight?: string;
  captionRight?: string;
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

export function RpcSendTransferWrapper({ children }: { children: React.ReactNode }) {
  const originLogoAnimation = useAnimationControls();
  const checkmarkEnters = useAnimationControls();

  return (
    <Flex
      flexDir="column"
      minH="100vh"
      background="ink.background-secondary"
      boxShadow="0px 0px 2px 0px rgba(18, 16, 15, 0.08), 0px 4px 8px 0px rgba(18, 16, 15, 0.08), 0px 12px 24px 0px rgba(18, 16, 15, 0.08)"
    >
      <Box mx="space.05" mt="space.05" height={18} width={86}>
        <LeatherLogomarkIcon height={18} width={86} />
      </Box>
      <Flex zIndex={0}>
        <motion.div style={{ display: 'inline-block', zIndex: 1 }} animate={originLogoAnimation}>
          <Box mx="space.05" mt="space.05">
            <FaviconDisplayer requester={origin} />
          </Box>
          <motion.img
            animate={checkmarkEnters}
            style={{ position: 'absolute', zIndex: 1, top: '50%', left: '50%' }}
            initial={{ scale: 0 }}
            src="assets/illustrations/black-circle-checkmark.svg"
          />
        </motion.div>
      </Flex>
      {children}
    </Flex>
  );
}

export function RpcSendTransferApproverContainer() {
  const [selectedFeeType, setSelectedFeeType] = useState<FeeType>('standard');
  const [editFeeSelected, setEditFeeSelected] = useState<FeeType>(selectedFeeType);
  const [customFeeRate, setCustomFeeRate] = useState<number | null>(null);

  const sendTransferState = useRpcSendTransfer();

  const { origin, recipients, utxos, amountAsMoney } = sendTransferState;

  const { feesList, isLoading, approverFeesList, getCustomFeeData } = useBitcoinFeesList({
    amount: amountAsMoney,
    recipients,
    utxos,
  });

  const customFeeData = getCustomFeeData(Number(customFeeRate));

  const selectedFeeData = useMemo(() => {
    if (selectedFeeType === 'custom') {
      return {
        feeType: selectedFeeType,
        titleLeft: 'Custom',
        feeRate: customFeeRate,
        captionLeft: customFeeData?.captionLeft,
        titleRight: customFeeData?.titleRight,
        captionRight: customFeeData?.captionRight,
      };
    }
    return approverFeesList.find(fee => fee.feeType === selectedFeeType);
  }, [approverFeesList, selectedFeeType, customFeeRate, customFeeData]);

  console.log('feesList', feesList);

  console.log('sendTransferState', sendTransferState);

  useEffect(() => {
    if (customFeeRate === null) {
      const data = approverFeesList.find(fee => fee.feeType === selectedFeeType);
      if (data) {
        setCustomFeeRate(data.feeRate);
      }
    }
  }, [approverFeesList, selectedFeeType, customFeeRate]);

  if (sendTransferState.origin === null) {
    closeWindow();
    throw new Error('Origin is null');
  }

  return (
    <>
      <Outlet
        context={{
          selectedFeeType,
          setSelectedFeeType,
          approverFeesList,
          selectedFeeData,
          editFeeSelected,
          setEditFeeSelected,
          customFeeRate,
          setCustomFeeRate,
          customFeeData,
          ...sendTransferState,
        }}
      />
    </>
  );
}

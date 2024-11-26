import { Outlet, useNavigate } from 'react-router-dom';

import { Center, Flex, HStack, Stack, styled } from 'leather-styles/jsx';

import type { BtcFeeType, Money } from '@leather.io/models';
import type { UtxoResponseItem } from '@leather.io/query';
import { Approver, Button } from '@leather.io/ui';

import { logger } from '@shared/logger';
import type { TransferRecipient } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';

import { useLocationStateWithCache } from '@app/common/hooks/use-location-state';
import { useGenerateUnsignedNativeSegwitTx } from '@app/common/transactions/bitcoin/use-generate-bitcoin-tx';
import {
  BitcoinFeesList,
  OnChooseFeeArgs,
} from '@app/components/bitcoin-fees-list/bitcoin-fees-list';
import { useBitcoinFeesList } from '@app/components/bitcoin-fees-list/use-bitcoin-fees-list-multiple-recipients';
import { Fees } from '@app/components/fees/fees';
import { ButtonRow } from '@app/components/layout';
import { BitcoinChooseFee } from '@app/features/bitcoin-choose-fee/bitcoin-choose-fee';
import { useValidateBitcoinSpend } from '@app/features/bitcoin-choose-fee/hooks/use-validate-bitcoin-spend';
import { useSignBitcoinTx } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';

import { formFeeRowValue } from '../../common/send/utils';
import { useRpcSendTransferState } from './rpc-send-transfer-container';
import { useRpcSendTransfer } from './use-rpc-send-transfer';

function useRpcSendTransferFeeState() {
  const amountAsMoney = useLocationStateWithCache('amountAsMoney') as Money;
  const recipients = useLocationStateWithCache('recipients') as TransferRecipient[];
  const utxos = useLocationStateWithCache('utxos') as UtxoResponseItem[];

  return { amountAsMoney, utxos, recipients };
}

export function RpcSendTransferChooseFeeLegacy() {
  const { selectedFeeType, setSelectedFeeType } = useRpcSendTransferState();
  const { amountAsMoney, utxos, recipients } = useRpcSendTransferFeeState();

  const navigate = useNavigate();

  const generateTx = useGenerateUnsignedNativeSegwitTx();
  const signTransaction = useSignBitcoinTx();
  const { feesList, isLoading } = useBitcoinFeesList({
    amount: amountAsMoney,
    recipients,
    utxos,
  });
  const recommendedFeeRate = feesList[1]?.feeRate.toString() || '';

  const { showInsufficientBalanceError, onValidateBitcoinFeeSpend } = useValidateBitcoinSpend();

  async function previewTransfer({ feeRate, feeValue, time, isCustomFee }: OnChooseFeeArgs) {
    const resp = await generateTx({ amount: amountAsMoney, recipients }, feeRate, utxos);

    if (!resp) return logger.error('Attempted to generate raw tx, but no tx exists');

    const tx = await signTransaction(resp.psbt);

    tx.finalize();

    const feeRowValue = formFeeRowValue(feeRate, isCustomFee);

    navigate(RouteUrls.RpcSendTransferConfirmation, {
      state: {
        fee: feeValue,
        recipients,
        time,
        tx: tx.hex,
        feeRowValue,
      },
    });
  }

  return (
    <>
      <Outlet />
      <BitcoinChooseFee
        amount={amountAsMoney}
        defaultToCustomFee={!feesList.length}
        feesList={
          <BitcoinFeesList
            feesList={feesList}
            isLoading={isLoading}
            onChooseFee={previewTransfer}
            onValidateBitcoinSpend={onValidateBitcoinFeeSpend}
            onSetSelectedFeeType={(value: BtcFeeType | null) => setSelectedFeeType(value)}
            selectedFeeType={selectedFeeType}
          />
        }
        isLoading={isLoading}
        isSendingMax={false}
        onChooseFee={previewTransfer}
        onSetSelectedFeeType={(value: BtcFeeType | null) => setSelectedFeeType(value)}
        onValidateBitcoinSpend={onValidateBitcoinFeeSpend}
        recipients={recipients}
        recommendedFeeRate={recommendedFeeRate}
        showError={showInsufficientBalanceError}
        maxRecommendedFeeRate={feesList[0]?.feeRate}
        px="0"
      />
    </>
  );
}

export function RpcSendTransferChooseFee() {
  const {
    amountAsMoney,
    utxos,
    recipients,
    approverFeesList,
    selectedFeeType,
    setSelectedFeeType,
    editFeeSelected,
    setEditFeeSelected,
    selectedFeeData,
    customFeeRate,
    setCustomFeeRate,
    customFeeData,
  } = useRpcSendTransferState();
  const navigate = useNavigate();
  const { feesList, isLoading } = useBitcoinFeesList({
    amount: amountAsMoney,
    recipients,
    utxos,
  });
  console.log('feesList', feesList);

  function onCancel() {
    navigate(RouteUrls.RpcSendTransfer);
    setCustomFeeRate(selectedFeeData.feeRate.toString());
    setEditFeeSelected(selectedFeeType);
  }

  function onSave() {
    setSelectedFeeType(editFeeSelected);
    if (editFeeSelected !== 'custom') {
      setCustomFeeRate(selectedFeeData.feeRate.toString());
    }
    navigate(RouteUrls.RpcSendTransfer);
  }

  return (
    <Approver height="100%" width="100%" requester={origin}>
      <Approver.Section>
        <Approver.Subheader justifyContent="center" mb="0">
          <Center>Edit Fee</Center>
        </Approver.Subheader>
      </Approver.Section>

      <Approver.Section>
        <Fees
          feesList={approverFeesList}
          editFeeSelected={editFeeSelected}
          setEditFeeSelected={setEditFeeSelected}
          availableBalance={200}
          customFeeData={customFeeData}
          customFeeRate={customFeeRate}
          setCustomFeeRate={setCustomFeeRate}
        />
      </Approver.Section>

      <Approver.Actions
        actions={[
          <Button key="cancel" onClick={onCancel} fullWidth variant="outline">
            Cancel
          </Button>,
          <Button key="save" onClick={onSave} fullWidth>
            Save
          </Button>,
        ]}
      />
    </Approver>
  );
}

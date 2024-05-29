import { Outlet, useNavigate } from 'react-router-dom';

import type { Money } from '@leather-wallet/models';
import type { UtxoResponseItem } from '@leather-wallet/query';

import { logger } from '@shared/logger';
import { BtcFeeType } from '@shared/models/fees/bitcoin-fees.model';
import type { TransferRecipient } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';

import { useLocationStateWithCache } from '@app/common/hooks/use-location-state';
import { useGenerateUnsignedNativeSegwitTx } from '@app/common/transactions/bitcoin/use-generate-bitcoin-tx';
import {
  BitcoinFeesList,
  OnChooseFeeArgs,
} from '@app/components/bitcoin-fees-list/bitcoin-fees-list';
import { useBitcoinFeesList } from '@app/components/bitcoin-fees-list/use-bitcoin-fees-list-multiple-recipients';
import { BitcoinChooseFee } from '@app/features/bitcoin-choose-fee/bitcoin-choose-fee';
import { useValidateBitcoinSpend } from '@app/features/bitcoin-choose-fee/hooks/use-validate-bitcoin-spend';
import { useSignBitcoinTx } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';

import { formFeeRowValue } from '../../common/send/utils';
import { useRpcSendTransferState } from './rpc-send-transfer-container';

function useRpcSendTransferFeeState() {
  const amountAsMoney = useLocationStateWithCache('amountAsMoney') as Money;
  const recipients = useLocationStateWithCache('recipients') as TransferRecipient[];
  const utxos = useLocationStateWithCache('utxos') as UtxoResponseItem[];

  return { amountAsMoney, utxos, recipients };
}

export function RpcSendTransferChooseFee() {
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

import { Outlet, useNavigate } from 'react-router-dom';

import { logger } from '@shared/logger';
import { BtcFeeType } from '@shared/models/fees/bitcoin-fees.model';
import { createMoney } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';

import { useLocationStateWithCache } from '@app/common/hooks/use-location-state';
import { useGenerateUnsignedNativeSegwitSingleRecipientTx } from '@app/common/transactions/bitcoin/use-generate-bitcoin-tx';
import {
  BitcoinFeesList,
  OnChooseFeeArgs,
} from '@app/components/bitcoin-fees-list/bitcoin-fees-list';
import { useBitcoinFeesList } from '@app/components/bitcoin-fees-list/use-bitcoin-fees-list';
import { BitcoinChooseFee } from '@app/features/bitcoin-choose-fee/bitcoin-choose-fee';
import { useValidateBitcoinSpend } from '@app/features/bitcoin-choose-fee/hooks/use-validate-bitcoin-spend';
import { UtxoResponseItem } from '@app/query/bitcoin/bitcoin-client';
import { useSignBitcoinTx } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';

import { formFeeRowValue } from '../../common/send/utils';
import { useRpcSendTransferState } from './rpc-send-transfer-container';

function useRpcSendTransferFeeState() {
  const amount = useLocationStateWithCache('amount');
  const amountAsMoney = createMoney(Number(amount), 'BTC');
  const utxos = useLocationStateWithCache('utxos') as UtxoResponseItem[];
  const address = useLocationStateWithCache('address') as string;

  return { address, amountAsMoney, utxos };
}

export function RpcSendTransferChooseFee() {
  const { selectedFeeType, setSelectedFeeType } = useRpcSendTransferState();
  const { address, amountAsMoney, utxos } = useRpcSendTransferFeeState();
  const navigate = useNavigate();

  const generateTx = useGenerateUnsignedNativeSegwitSingleRecipientTx();
  const signTransaction = useSignBitcoinTx();
  const { feesList, isLoading } = useBitcoinFeesList({
    amount: amountAsMoney,
    recipient: address,
    utxos,
  });
  const recommendedFeeRate = feesList[1]?.feeRate.toString() || '';

  const { showInsufficientBalanceError, onValidateBitcoinFeeSpend } = useValidateBitcoinSpend();

  async function previewTransfer({ feeRate, feeValue, time, isCustomFee }: OnChooseFeeArgs) {
    const resp = await generateTx({ amount: amountAsMoney, recipient: address }, feeRate, utxos);

    if (!resp) return logger.error('Attempted to generate raw tx, but no tx exists');

    const tx = await signTransaction(resp.psbt);

    tx.finalize();

    const feeRowValue = formFeeRowValue(feeRate, isCustomFee);

    navigate(RouteUrls.RpcSendTransferConfirmation, {
      state: {
        fee: feeValue,
        recipient: address,
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
        feesList={
          <BitcoinFeesList
            feesList={feesList}
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
        recipient={address}
        recommendedFeeRate={recommendedFeeRate}
        showError={showInsufficientBalanceError}
        maxRecommendedFeeRate={feesList[0]?.feeRate}
        px="0"
      />
    </>
  );
}

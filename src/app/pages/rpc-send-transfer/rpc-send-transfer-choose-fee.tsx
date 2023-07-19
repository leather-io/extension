import { useLocation, useNavigate } from 'react-router-dom';

import get from 'lodash.get';

import { logger } from '@shared/logger';
import { BtcFeeType } from '@shared/models/fees/bitcoin-fees.model';
import { createMoney } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';
import { noop } from '@shared/utils';

import { useGenerateSignedNativeSegwitTx } from '@app/common/transactions/bitcoin/use-generate-bitcoin-tx';
import { useWalletType } from '@app/common/use-wallet-type';
import {
  BitcoinFeesList,
  OnChooseFeeArgs,
} from '@app/components/bitcoin-fees-list/bitcoin-fees-list';
import { useBitcoinFeesList } from '@app/components/bitcoin-fees-list/use-bitcoin-fees-list';
import { BitcoinChooseFee } from '@app/features/bitcoin-choose-fee/bitcoin-choose-fee';
import { useValidateBitcoinSpend } from '@app/features/bitcoin-choose-fee/hooks/use-validate-bitcoin-spend';
import { UtxoResponseItem } from '@app/query/bitcoin/bitcoin-client';

import { formFeeRowValue } from '../../common/send/utils';
import { useRpcSendTransferState } from './rpc-send-transfer-container';

function useRpcSendTransferFeeState() {
  const location = useLocation();
  const amount = get(location.state, 'amount');
  const amountAsMoney = createMoney(Number(amount), 'BTC');
  const utxos = get(location.state, 'utxos') as UtxoResponseItem[];

  return {
    address: get(location.state, 'address') as string,
    amountAsMoney,
    utxos,
  };
}

export function RpcSendTransferChooseFee() {
  const { selectedFeeType, setSelectedFeeType } = useRpcSendTransferState();
  const { address, amountAsMoney, utxos } = useRpcSendTransferFeeState();
  const navigate = useNavigate();
  const { whenWallet } = useWalletType();
  const generateTx = useGenerateSignedNativeSegwitTx();
  const { feesList, isLoading } = useBitcoinFeesList({
    amount: Number(amountAsMoney.amount),
    recipient: address,
    utxos,
  });
  const recommendedFeeRate = feesList[1]?.feeRate.toString() || '';

  const { showInsufficientBalanceError, onValidateBitcoinFeeSpend } = useValidateBitcoinSpend();

  async function previewTransfer({ feeRate, feeValue, time, isCustomFee }: OnChooseFeeArgs) {
    const resp = generateTx({ amount: amountAsMoney, recipient: address }, feeRate, utxos);

    if (!resp) return logger.error('Attempted to generate raw tx, but no tx exists');

    const { hex } = resp;

    const feeRowValue = formFeeRowValue(feeRate, isCustomFee);
    whenWallet({
      software: () =>
        navigate(RouteUrls.RpcSendTransferConfirmation, {
          state: {
            fee: feeValue,
            recipient: address,
            time,
            tx: hex,
            feeRowValue,
          },
        }),
      ledger: noop,
    })();
  }

  return (
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
    />
  );
}

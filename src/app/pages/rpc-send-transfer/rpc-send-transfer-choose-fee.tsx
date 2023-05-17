import { useLocation, useNavigate } from 'react-router-dom';

import get from 'lodash.get';

import { logger } from '@shared/logger';
import { BtcFeeType } from '@shared/models/fees/bitcoin-fees.model';
import { createMoney } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';
import { noop } from '@shared/utils';

import { useGenerateSignedBitcoinTx } from '@app/common/transactions/bitcoin/use-generate-bitcoin-tx';
import { useWalletType } from '@app/common/use-wallet-type';
import {
  BitcoinFeesList,
  OnChooseFeeArgs,
} from '@app/components/bitcoin-fees-list/bitcoin-fees-list';
import { useBitcoinFeesList } from '@app/components/bitcoin-fees-list/use-bitcoin-fees-list';

import { useRpcSendTransferState } from './rpc-send-transfer-container';

function useRpcSendTransferFeeState() {
  const location = useLocation();
  const amount = get(location.state, 'amount');
  const amountAsMoney = createMoney(Number(amount), 'BTC');

  return {
    address: get(location.state, 'address') as string,
    amountAsMoney,
  };
}

export function RpcSendTransferChooseFee() {
  const { selectedFeeType, setSelectedFeeType } = useRpcSendTransferState();
  const { address, amountAsMoney } = useRpcSendTransferFeeState();
  const navigate = useNavigate();
  const { whenWallet } = useWalletType();
  const generateTx = useGenerateSignedBitcoinTx();
  const { feesList, isLoading } = useBitcoinFeesList({
    amount: Number(amountAsMoney.amount),
    recipient: address,
  });

  async function previewTransfer({ feeRate, feeValue, time }: OnChooseFeeArgs) {
    const resp = generateTx({ amount: amountAsMoney, recipient: address }, feeRate);

    if (!resp) return logger.error('Attempted to generate raw tx, but no tx exists');

    const { hex } = resp;

    whenWallet({
      software: () =>
        navigate(RouteUrls.RpcSendTransferConfirmation, {
          state: {
            fee: feeValue,
            recipient: address,
            time,
            tx: hex,
          },
        }),
      ledger: noop,
    })();
  }

  return (
    <BitcoinFeesList
      amount={amountAsMoney}
      feesList={feesList}
      isLoading={isLoading}
      onChooseFee={previewTransfer}
      onSetSelectedFeeType={(value: BtcFeeType) => setSelectedFeeType(value)}
      selectedFeeType={selectedFeeType}
    />
  );
}

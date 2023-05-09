import { useLocation, useNavigate } from 'react-router-dom';

import get from 'lodash.get';

import { logger } from '@shared/logger';
import { createMoney } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';
import { noop } from '@shared/utils';

import { useGenerateSignedBitcoinTx } from '@app/common/transactions/bitcoin/use-generate-bitcoin-tx';
import { useWalletType } from '@app/common/use-wallet-type';
import { BitcoinFeesList } from '@app/components/bitcoin-fees-list/bitcoin-fees-list';
import { useBitcoinFeesList } from '@app/components/bitcoin-fees-list/use-bitcoin-fees-list';

function useRpcSendTransferFeeState() {
  const location = useLocation();
  return {
    address: get(location.state, 'address') as string,
    amount: get(location.state, 'amount') as string,
  };
}

export function RpcSendTransferChooseFee() {
  const { address, amount } = useRpcSendTransferFeeState();
  const navigate = useNavigate();
  const { whenWallet } = useWalletType();
  const generateTx = useGenerateSignedBitcoinTx();
  const { feesList, isLoading } = useBitcoinFeesList({
    amount: Number(amount),
    recipient: address,
  });

  async function previewTransfer(feeRate: number, feeValue: number, time: string) {
    const resp = generateTx(
      { amount: createMoney(Number(amount), 'BTC'), recipient: address },
      feeRate
    );

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
    <BitcoinFeesList feesList={feesList} isLoading={isLoading} onChooseFee={previewTransfer} />
  );
}

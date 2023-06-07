import { useLocation, useNavigate } from 'react-router-dom';

import get from 'lodash.get';

import { logger } from '@shared/logger';
import { BtcFeeType } from '@shared/models/fees/bitcoin-fees.model';
import { BitcoinSendFormValues } from '@shared/models/form.model';
import { createMoney } from '@shared/models/money.model';
import { noop } from '@shared/utils';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { btcToSat } from '@app/common/money/unit-conversion';
import { useGenerateSignedNativeSegwitTx } from '@app/common/transactions/bitcoin/use-generate-bitcoin-tx';
import { useWalletType } from '@app/common/use-wallet-type';
import {
  BitcoinFeesList,
  OnChooseFeeArgs,
} from '@app/components/bitcoin-fees-list/bitcoin-fees-list';
import { BitcoinFeesListLayout } from '@app/components/bitcoin-fees-list/components/bitcoin-fees-list.layout';
import { useBitcoinFeesList } from '@app/components/bitcoin-fees-list/use-bitcoin-fees-list';
import { ModalHeader } from '@app/components/modal-header';

import { useSendBtcState } from '../../family/bitcoin/components/send-btc-container';
import { useCalculateMaxBitcoinSpend } from '../../family/bitcoin/hooks/use-calculate-max-spend';
import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';

function useBtcChooseFeeState() {
  const location = useLocation();
  return {
    isSendingMax: get(location.state, 'isSendingMax') as boolean,
    txValues: get(location.state, 'values') as BitcoinSendFormValues,
  };
}

export function BtcChooseFee() {
  const { isSendingMax, txValues } = useBtcChooseFeeState();
  const navigate = useNavigate();
  const { whenWallet } = useWalletType();
  const sendFormNavigate = useSendFormNavigate();
  const generateTx = useGenerateSignedNativeSegwitTx();
  const { selectedFeeType, setSelectedFeeType } = useSendBtcState();
  const calcMaxSpend = useCalculateMaxBitcoinSpend();
  const { feesList, isLoading } = useBitcoinFeesList({
    amount: Number(txValues.amount),
    isSendingMax,
    recipient: txValues.recipient,
  });

  const amountAsMoney = createMoney(btcToSat(txValues.amount).toNumber(), 'BTC');

  async function previewTransaction({ feeRate, feeValue, time }: OnChooseFeeArgs) {
    const resp = generateTx(
      {
        amount: isSendingMax
          ? createMoney(btcToSat(calcMaxSpend(txValues.recipient, feeRate).spendableBitcoin), 'BTC')
          : amountAsMoney,
        recipient: txValues.recipient,
      },
      feeRate,
      isSendingMax
    );

    if (!resp) return logger.error('Attempted to generate raw tx, but no tx exists');

    const { hex } = resp;

    whenWallet({
      software: () =>
        sendFormNavigate.toConfirmAndSignBtcTransaction({
          tx: hex,
          recipient: txValues.recipient,
          fee: feeValue,
          time,
        }),
      ledger: noop,
    })();
  }

  function onGoBack() {
    setSelectedFeeType(null);
    navigate(-1);
  }

  useRouteHeader(<ModalHeader hideActions onGoBack={onGoBack} title="Choose fee" />);

  return (
    <BitcoinFeesListLayout>
      <BitcoinFeesList
        amount={amountAsMoney}
        feesList={feesList}
        isLoading={isLoading}
        isSendingMax={isSendingMax}
        onChooseFee={previewTransaction}
        onSetSelectedFeeType={(value: BtcFeeType) => setSelectedFeeType(value)}
        selectedFeeType={selectedFeeType}
      />
    </BitcoinFeesListLayout>
  );
}

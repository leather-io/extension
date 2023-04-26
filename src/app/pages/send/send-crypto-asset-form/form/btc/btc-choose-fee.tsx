import { useLocation } from 'react-router-dom';

import get from 'lodash.get';

import { logger } from '@shared/logger';
import { BitcoinSendFormValues } from '@shared/models/form.model';
import { createMoney } from '@shared/models/money.model';
import { noop } from '@shared/utils';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { btcToSat } from '@app/common/money/unit-conversion';
import { useGenerateSignedBitcoinTx } from '@app/common/transactions/bitcoin/use-generate-bitcoin-tx';
import { useWalletType } from '@app/common/use-wallet-type';
import { BitcoinFeesList } from '@app/components/bitcoin-fees-list/bitcoin-fees-list';
import { BitcoinFeesListLayout } from '@app/components/bitcoin-fees-list/components/bitcoin-fees-list.layout';
import { ModalHeader } from '@app/components/modal-header';

import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';

function useBtcChooseFeeState() {
  const location = useLocation();
  return {
    txValues: get(location.state, 'values') as BitcoinSendFormValues,
  };
}

export function BtcChooseFee() {
  const { txValues } = useBtcChooseFeeState();
  const { whenWallet } = useWalletType();
  const sendFormNavigate = useSendFormNavigate();
  const generateTx = useGenerateSignedBitcoinTx();

  async function previewTransaction(feeRate: number, feeValue: number, time: string) {
    const resp = generateTx(
      {
        amount: createMoney(btcToSat(txValues.amount).toNumber(), 'BTC'),
        recipient: txValues.recipient,
      },
      feeRate
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

  useRouteHeader(<ModalHeader hideActions defaultGoBack title="Choose fee" />);

  return (
    <BitcoinFeesListLayout>
      <BitcoinFeesList
        amount={Number(txValues.amount)}
        onChooseFee={previewTransaction}
        recipient={txValues.recipient}
      />
    </BitcoinFeesListLayout>
  );
}

import { useLocation } from 'react-router-dom';

import get from 'lodash.get';

import { logger } from '@shared/logger';
import { BitcoinSendFormValues } from '@shared/models/form.model';
import { noop } from '@shared/utils';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useWalletType } from '@app/common/use-wallet-type';
import { ModalHeader } from '@app/components/modal-header';

import { BitcoinSetFee } from '../../family/bitcoin/components/bitcoin-set-fee';
import { useGenerateSignedBitcoinTx } from '../../family/bitcoin/hooks/use-generate-bitcoin-tx';
import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';

function useBtcSetFeeState() {
  const location = useLocation();
  return {
    txValues: get(location.state, 'values') as BitcoinSendFormValues,
  };
}

export function BtcSetFee() {
  const { txValues } = useBtcSetFeeState();
  const { whenWallet } = useWalletType();
  const sendFormNavigate = useSendFormNavigate();
  const generateTx = useGenerateSignedBitcoinTx();

  async function previewTransaction(feeRate: number, feeValue: number, time: string) {
    const resp = generateTx(txValues, feeRate);

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
    <BitcoinSetFee
      onChooseFee={previewTransaction}
      recipient={txValues.recipient}
      amount={Number(txValues.amount)}
    />
  );
}

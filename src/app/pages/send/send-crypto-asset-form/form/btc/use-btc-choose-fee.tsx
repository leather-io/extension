import { useNavigate } from 'react-router-dom';

import { logger } from '@shared/logger';
import { BtcFeeType } from '@shared/models/fees/bitcoin-fees.model';
import { createMoney } from '@shared/models/money.model';

import { btcToSat } from '@app/common/money/unit-conversion';
import { formFeeRowValue } from '@app/common/send/utils';
import { useGenerateUnsignedNativeSegwitTx } from '@app/common/transactions/bitcoin/use-generate-bitcoin-tx';
import { OnChooseFeeArgs } from '@app/components/bitcoin-fees-list/bitcoin-fees-list';

import { useSendBitcoinAssetContextState } from '../../family/bitcoin/components/send-bitcoin-asset-container';
import { useCalculateMaxBitcoinSpend } from '../../family/bitcoin/hooks/use-calculate-max-spend';
import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';
import { useBtcChooseFeeState } from './btc-choose-fee';

export function useBtcChooseFee() {
  const { isSendingMax, txValues, utxos } = useBtcChooseFeeState();
  const navigate = useNavigate();

  const sendFormNavigate = useSendFormNavigate();
  const { generateTx, sign } = useGenerateUnsignedNativeSegwitTx();

  const { setSelectedFeeType } = useSendBitcoinAssetContextState();
  const calcMaxSpend = useCalculateMaxBitcoinSpend();

  const amountAsMoney = createMoney(btcToSat(txValues.amount).toNumber(), 'BTC');

  return {
    amountAsMoney,
    onGoBack() {
      setSelectedFeeType(BtcFeeType.Standard);
      navigate(-1);
    },

    async previewTransaction({ feeRate, feeValue, time, isCustomFee }: OnChooseFeeArgs) {
      const txResp = generateTx(
        {
          amount: isSendingMax
            ? calcMaxSpend(txValues.recipient, utxos, feeRate).amount
            : amountAsMoney,
          recipient: txValues.recipient,
        },
        feeRate,
        utxos,
        isSendingMax
      );

      if (!txResp) return logger.error('Attempted to generate raw tx, but no tx exists');

      const feeRowValue = formFeeRowValue(feeRate, isCustomFee);

      sign(txResp.tx);
      sendFormNavigate.toConfirmAndSignBtcTransaction({
        tx: txResp.tx.hex,
        recipient: txValues.recipient,
        fee: feeValue,
        feeRowValue,
        time,
      });
    },
  };
}

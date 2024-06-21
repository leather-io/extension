import { btcToSat, createMoney } from '@leather.io/utils';

import { logger } from '@shared/logger';

import { formFeeRowValue } from '@app/common/send/utils';
import { useGenerateUnsignedNativeSegwitTx } from '@app/common/transactions/bitcoin/use-generate-bitcoin-tx';
import { OnChooseFeeArgs } from '@app/components/bitcoin-fees-list/bitcoin-fees-list';
import { useSignBitcoinTx } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';

import { useCalculateMaxBitcoinSpend } from '../../family/bitcoin/hooks/use-calculate-max-spend';
import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';
import { useBtcChooseFeeState } from './btc-choose-fee';

export function useBtcChooseFee() {
  const { isSendingMax, txValues, utxos } = useBtcChooseFeeState();
  const sendFormNavigate = useSendFormNavigate();
  const generateTx = useGenerateUnsignedNativeSegwitTx();
  const calcMaxSpend = useCalculateMaxBitcoinSpend();
  const signTx = useSignBitcoinTx();
  const amountAsMoney = createMoney(btcToSat(txValues.amount).toNumber(), 'BTC');

  return {
    amountAsMoney,

    async previewTransaction({ feeRate, feeValue, time, isCustomFee }: OnChooseFeeArgs) {
      const amount = isSendingMax
        ? calcMaxSpend(txValues.recipient, utxos, feeRate).amount
        : amountAsMoney;

      const resp = await generateTx(
        {
          amount,
          recipients: [
            {
              address: txValues.recipient,
              amount,
            },
          ],
        },
        feeRate,
        utxos,
        isSendingMax
      );
      const feeRowValue = formFeeRowValue(feeRate, isCustomFee);
      if (!resp) return logger.error('Attempted to generate raw tx, but no tx exists');

      const signedTx = await signTx(resp.psbt);

      if (!signedTx) return logger.error('Attempted to sign tx, but no tx exists');

      signedTx.finalize();

      sendFormNavigate.toConfirmAndSignBtcTransaction({
        tx: signedTx.hex,
        recipient: txValues.recipient,
        fee: feeValue,
        feeRowValue,
        time,
      });
    },
  };
}

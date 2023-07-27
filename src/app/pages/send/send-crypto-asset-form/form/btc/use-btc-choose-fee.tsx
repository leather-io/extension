import { useNavigate } from 'react-router-dom';

import { bytesToHex } from '@noble/hashes/utils';

import { logger } from '@shared/logger';
import { BtcFeeType } from '@shared/models/fees/bitcoin-fees.model';
import { createMoney } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';

import { btcToSat } from '@app/common/money/unit-conversion';
import { formFeeRowValue } from '@app/common/send/utils';
import { useGenerateSignedNativeSegwitTx } from '@app/common/transactions/bitcoin/use-generate-bitcoin-tx';
import { useWalletType } from '@app/common/use-wallet-type';
import { OnChooseFeeArgs } from '@app/components/bitcoin-fees-list/bitcoin-fees-list';

import { useSendBitcoinAssetContextState } from '../../family/bitcoin/components/send-bitcoin-asset-container';
import { useCalculateMaxBitcoinSpend } from '../../family/bitcoin/hooks/use-calculate-max-spend';
import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';
import { useBtcChooseFeeState } from './btc-choose-fee';

export function useBtcChooseFee() {
  const { isSendingMax, txValues, utxos } = useBtcChooseFeeState();
  const navigate = useNavigate();
  const { whenWallet } = useWalletType();
  const sendFormNavigate = useSendFormNavigate();
  const generateTx = useGenerateSignedNativeSegwitTx();
  const { setSelectedFeeType } = useSendBitcoinAssetContextState();
  const calcMaxSpend = useCalculateMaxBitcoinSpend();
  // const signLedger = useSignNativeSegwitLedgerTx();

  const amountAsMoney = createMoney(btcToSat(txValues.amount).toNumber(), 'BTC');

  return {
    amountAsMoney,
    onGoBack() {
      setSelectedFeeType(BtcFeeType.Standard);
      navigate(-1);
    },

    async previewTransaction({ feeRate, feeValue, time, isCustomFee }: OnChooseFeeArgs) {
      const resp = await generateTx(
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
      const feeRowValue = formFeeRowValue(feeRate, isCustomFee);
      if (!resp) return logger.error('Attempted to generate raw tx, but no tx exists');

      void whenWallet({
        software: async () => {
          sendFormNavigate.toConfirmAndSignBtcTransaction({
            tx: resp.hex,
            recipient: txValues.recipient,
            fee: feeValue,
            feeRowValue,
            time,
          });
        },
        ledger: async () => {
          console.log('opening route with', resp.hex);
          // const app = await connectLedgerBitcoinApp();
          navigate(RouteUrls.ConnectLedger, {
            replace: true,
            state: {
              tx: bytesToHex(resp.psbt),
              recipient: txValues.recipient,
              fee: feeValue,
              feeRowValue,
              time,
            },
          });
        },
      })();
    },
  };
}

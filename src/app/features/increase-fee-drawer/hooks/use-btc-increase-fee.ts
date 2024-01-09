import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import * as btc from '@scure/btc-signer';
import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { createMoney } from '@shared/models/money.model';
import { BitcoinTx } from '@shared/models/transactions/bitcoin-transaction.model';
import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useBtcAssetBalance } from '@app/common/hooks/balance/btc/use-btc-balance';
import { btcToSat } from '@app/common/money/unit-conversion';
import { queryClient } from '@app/common/persistence';
import {
  getBitcoinTxValue,
  getRecipientAddressFromOutput,
  getSizeInfo,
} from '@app/common/transactions/bitcoin/utils';
import { MAX_FEE_RATE_MULTIPLIER } from '@app/components/bitcoin-custom-fee/hooks/use-bitcoin-custom-fee';
import { useBitcoinFeesList } from '@app/components/bitcoin-fees-list/use-bitcoin-fees-list';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { useBitcoinBroadcastTransaction } from '@app/query/bitcoin/transaction/use-bitcoin-broadcast-transaction';
import { useBitcoinScureLibNetworkConfig } from '@app/store/accounts/blockchain/bitcoin/bitcoin-keychain';
import { useSignBitcoinTx } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

export function useBtcIncreaseFee(btcTx: BitcoinTx) {
  const navigate = useNavigate();
  const networkMode = useBitcoinScureLibNetworkConfig();
  const analytics = useAnalytics();

  const { address: currentBitcoinAddress, publicKey } =
    useCurrentAccountNativeSegwitIndexZeroSigner();
  const { data: utxos = [], refetch } = useCurrentNativeSegwitUtxos();
  const signTransaction = useSignBitcoinTx();
  const { broadcastTx, isBroadcasting } = useBitcoinBroadcastTransaction();
  const recipient = getRecipientAddressFromOutput(btcTx.vout, currentBitcoinAddress) || '';
  const sizeInfo = getSizeInfo({
    inputLength: btcTx.vin.length,
    recipient,
    outputLength: btcTx.vout.length,
  });

  const { btcAvailableAssetBalance } = useBtcAssetBalance(currentBitcoinAddress);
  const sendingAmount = getBitcoinTxValue(currentBitcoinAddress, btcTx);
  const { feesList } = useBitcoinFeesList({
    amount: createMoney(btcToSat(sendingAmount), 'BTC'),
    isSendingMax: false,
    recipient,
    utxos,
  });

  function generateUnsignedTx(payload: { feeRate: string; tx: BitcoinTx }) {
    const newTx = new btc.Transaction();
    const { vin, vout, fee: prevFee } = payload.tx;
    const p2wpkh = btc.p2wpkh(publicKey, networkMode);

    vin.forEach(input => {
      newTx.addInput({
        txid: input.txid,
        index: input.vout,
        sequence: input.sequence + 1,
        witnessUtxo: {
          // script = 0014 + pubKeyHash
          script: p2wpkh.script,
          amount: BigInt(input.prevout.value),
        },
      });
    });

    const newFee = Math.ceil(sizeInfo.txVBytes * Number(payload.feeRate));
    const feeDiff = newFee - prevFee;

    vout.forEach(output => {
      if (output.scriptpubkey_address === currentBitcoinAddress) {
        const outputDiff = output.value - feeDiff;

        if (outputDiff < 0) {
          void analytics.track('bitcoin_rbf_fee_increase_error', {
            outputDiff,
          });
          throw new Error('Previous tx inputs cannot cover new fee');
        }

        newTx.addOutputAddress(currentBitcoinAddress, BigInt(outputDiff), networkMode);
        return;
      }
      newTx.addOutputAddress(recipient, BigInt(output.value), networkMode);
    });

    return newTx;
  }

  async function initiateTransaction(unsignedTx: btc.Transaction) {
    const tx = await signTransaction(unsignedTx.toPSBT());
    tx.finalize();
    await broadcastTx({
      tx: tx.hex,
      async onSuccess(txid) {
        navigate(RouteUrls.IncreaseFeeSent);
        void analytics.track('increase_fee_transaction', {
          symbol: 'btc',
          txid,
        });
        await refetch();
        void queryClient.invalidateQueries({ queryKey: ['btc-txs-by-address'] });
      },
      onError,
      delayTime: 5000,
    });
  }

  async function onSubmit(values: { feeRate: string }) {
    try {
      const tx = generateUnsignedTx({ feeRate: values.feeRate, tx: btcTx });
      await initiateTransaction(tx);
    } catch (e) {
      onError(e);
    }
  }

  function onError(error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    toast.error(message);
    navigate(RouteUrls.Home);
  }

  const validationSchema = yup.object({
    feeRate: yup
      .number()
      .integer('Fee must be a whole number')
      .required('Fee is required')
      .test({
        message: 'Fee rate cannot be less or equal to previous',
        test(value) {
          const bnValue = new BigNumber(value);
          const prevFee = new BigNumber(btcTx.fee);

          return prevFee.isLessThan(bnValue.multipliedBy(sizeInfo.txVBytes));
        },
      })
      .test({
        message: 'Fee is too high',
        test(value) {
          const bnValue = new BigNumber(value);

          // check if fee is higher than 50 times the highest fee
          if (
            feesList.length > 0 &&
            bnValue.isGreaterThan(feesList[0].feeRate * MAX_FEE_RATE_MULTIPLIER)
          ) {
            return false;
          }

          // check if fee is higher than the available balance
          return bnValue.isLessThanOrEqualTo(btcAvailableAssetBalance.balance.amount);
        },
      }),
  });

  return {
    generateTx: generateUnsignedTx,
    initiateTransaction,
    isBroadcasting,
    sizeInfo,
    onSubmit,
    validationSchema,
    recipient,
  };
}

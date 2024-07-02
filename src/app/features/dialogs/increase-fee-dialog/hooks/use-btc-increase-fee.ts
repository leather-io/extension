import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import * as btc from '@scure/btc-signer';
import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import type { BitcoinTx } from '@leather.io/models';
import { useBitcoinBroadcastTransaction } from '@leather.io/query';
import { btcToSat, createMoney, isError } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';
import { analytics } from '@shared/utils/analytics';

import { queryClient } from '@app/common/persistence';
import {
  getBitcoinTxSizeEstimation,
  getBitcoinTxValue,
  getRecipientAddressFromOutput,
} from '@app/common/transactions/bitcoin/utils';
import { MAX_FEE_RATE_MULTIPLIER } from '@app/components/bitcoin-custom-fee/hooks/use-bitcoin-custom-fee';
import { useBitcoinFeesList } from '@app/components/bitcoin-fees-list/use-bitcoin-fees-list';
import { useToast } from '@app/features/toasts/use-toast';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { useBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';
import { useBitcoinScureLibNetworkConfig } from '@app/store/accounts/blockchain/bitcoin/bitcoin-keychain';
import { useSignBitcoinTx } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

export function useBtcIncreaseFee(btcTx: BitcoinTx) {
  const toast = useToast();
  const navigate = useNavigate();
  const networkMode = useBitcoinScureLibNetworkConfig();

  const { address: currentBitcoinAddress, publicKey } =
    useCurrentAccountNativeSegwitIndexZeroSigner();
  const { data: utxos = [], refetch } = useCurrentNativeSegwitUtxos();
  const signTransaction = useSignBitcoinTx();
  const { broadcastTx, isBroadcasting } = useBitcoinBroadcastTransaction();
  const recipient = getRecipientAddressFromOutput(btcTx.vout, currentBitcoinAddress) || '';

  const sizeInfo = useMemo(
    () =>
      getBitcoinTxSizeEstimation({
        inputCount: btcTx.vin.length,
        recipient,
        outputCount: btcTx.vout.length,
      }),
    [btcTx.vin.length, btcTx.vout.length, recipient]
  );

  const { balance } = useBtcCryptoAssetBalanceNativeSegwit(currentBitcoinAddress);
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
        toast.success('Fee increased successfully');
        navigate(RouteUrls.Activity);
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
    const message = isError(error) ? error.message : 'Unknown error';
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
          return bnValue.isLessThanOrEqualTo(balance.availableBalance.amount);
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

import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import * as btc from '@scure/btc-signer';
import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { BitcoinTx } from '@shared/models/transactions/bitcoin-transaction.model';
import { RouteUrls } from '@shared/route-urls';
import { analytics } from '@shared/utils/analytics';

import { useBtcAssetBalance } from '@app/common/hooks/balance/btc/use-btc-balance';
import { queryClient } from '@app/common/persistence';
import { determineUtxosForSpend } from '@app/common/transactions/bitcoin/coinselect/local-coin-selection';
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
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

export function useBtcIncreaseFee(btcTx: BitcoinTx) {
  const navigate = useNavigate();
  const networkMode = useBitcoinScureLibNetworkConfig();

  const {
    address: currentBitcoinAddress,
    sign,
    publicKeychain: currentAddressIndexKeychain,
  } = useCurrentAccountNativeSegwitIndexZeroSigner();
  const { data: utxos = [], refetch } = useCurrentNativeSegwitUtxos();
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
    amount: Number(sendingAmount),
    isSendingMax: false,
    recipient,
    utxos,
  });

  function generateTx(payload: { feeRate: string; tx: BitcoinTx }) {
    const newTx = new btc.Transaction();
    const { vin, vout, fee: prevFee } = payload.tx;
    const p2wpkh = btc.p2wpkh(currentAddressIndexKeychain.publicKey!, networkMode);

    // add old inputs to new tx
    vin.forEach(input => {
      newTx.addInput({
        txid: input.txid,
        index: input.vout,
        sequence: input.sequence + 1,
        witnessUtxo: {
          script: p2wpkh.script,
          amount: BigInt(input.prevout.value),
        },
      });
    });

    const { returnAmount, sentAmount } = getSentAndReturnTxAmount();
    const newFee = new BigNumber(Math.ceil(sizeInfo.txVBytes * Number(payload.feeRate)));

    // if current tx inputs cannot cover new fee
    const shouldAddInputs = newFee.isGreaterThan(returnAmount);
    if (shouldAddInputs) {
      const { inputs: additionalInputs, outputs } = determingInputsOutputsForNewFee(
        Number(payload.feeRate)
      );

      additionalInputs.forEach(input => {
        newTx.addInput({
          txid: input.txid,
          index: input.vout,
          sequence: 0,
          witnessUtxo: {
            script: p2wpkh.script,
            amount: BigInt(input.value),
          },
        });
      });
      outputs.forEach(output => {
        if (!output.address) {
          newTx.addOutputAddress(currentBitcoinAddress, BigInt(output.value), networkMode);
          return;
        }

        newTx.addOutputAddress(recipient, BigInt(sentAmount.toNumber()), networkMode);
      });
    }

    // if current tx inputs can cover new fee
    if (!shouldAddInputs) {
      const feeDiff = newFee.minus(prevFee);

      vout.forEach(output => {
        if (output.scriptpubkey_address === currentBitcoinAddress) {
          newTx.addOutputAddress(
            currentBitcoinAddress,
            BigInt(output.value - feeDiff.toNumber()),
            networkMode
          );
          return;
        }
        newTx.addOutputAddress(recipient, BigInt(output.value), networkMode);
      });
    }

    sign(newTx);
    newTx.finalize();

    return { hex: newTx.hex };
  }

  function getSentAndReturnTxAmount() {
    const { vout } = btcTx;
    let sentAmount = new BigNumber(0);
    let returnAmount = new BigNumber(0);

    vout.forEach(item => {
      if (item.scriptpubkey_address === currentBitcoinAddress) {
        returnAmount = returnAmount.plus(item.value);
        return;
      }
      sentAmount = sentAmount.plus(item.value);
    });

    return {
      sentAmount,
      returnAmount,
    };
  }

  async function initiateTransaction(tx: string) {
    await broadcastTx({
      tx,
      async onSuccess(txid) {
        void analytics.track('increase_fee_transaction', {
          symbol: 'btc',
          txid,
        });
        await refetch();
        void queryClient.invalidateQueries({ queryKey: ['btc-txs-by-address'] });
      },
      delayTime: 5000,
    });
  }

  async function onSubmit(values: { feeRate: string }) {
    try {
      const { hex } = generateTx({ feeRate: values.feeRate, tx: btcTx });
      await initiateTransaction(hex);
      navigate(RouteUrls.IncreaseFeeSent);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      toast.error(message);
      navigate(RouteUrls.Home);
    }
  }

  function determingInputsOutputsForNewFee(feeRate: number) {
    const { returnAmount } = getSentAndReturnTxAmount();
    const newFee = new BigNumber(Math.ceil(sizeInfo.txVBytes * feeRate));

    // if current tx inputs cannot cover new fee
    const diff = newFee.minus(returnAmount);
    const diffRate = diff.dividedBy(sizeInfo.txVBytes);
    const { inputs, outputs } = determineUtxosForSpend({
      amount: 0,
      feeRate: diffRate.toNumber(),
      recipient,
      utxos,
    });

    return { inputs, outputs };
  }

  const validationSchema = yup.object({
    feeRate: yup
      .number()
      .integer('Fee must be an integer')
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
    generateTx,
    initiateTransaction,
    isBroadcasting,
    sizeInfo,
    onSubmit,
    validationSchema,
    recipient,
  };
}

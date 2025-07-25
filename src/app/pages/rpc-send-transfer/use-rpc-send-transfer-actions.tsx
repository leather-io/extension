import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { createRpcSuccessResponse } from '@leather.io/rpc';
import { delay } from '@leather.io/utils';

import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';
import { closeWindow } from '@shared/utils';
import { analytics } from '@shared/utils/analytics';

import { useGenerateUnsignedNativeSegwitTx } from '@app/common/transactions/bitcoin/use-generate-bitcoin-tx';
import { getTransactionActions } from '@app/components/rpc-transaction-request/get-transaction-actions';
import { useInscribedSpendableUtxos } from '@app/features/discarded-inscriptions/use-inscribed-spendable-utxos';
import { useFeeEditorContext } from '@app/features/fee-editor/fee-editor.context';
import { useBitcoinBroadcastTransaction } from '@app/query/bitcoin/transaction/use-bitcoin-broadcast-transaction';
import { useSignBitcoinTx } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';

import { useRpcSendTransferContext } from './rpc-send-transfer.context';

export function useRpcSendTransferActions() {
  const { availableBalance, selectedFee } = useFeeEditorContext();
  const { amount, isLoadingBalance, recipients, requestId, tabId, utxos } =
    useRpcSendTransferContext();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const generateTx = useGenerateUnsignedNativeSegwitTx({ throwError: true });
  const signTransaction = useSignBitcoinTx();
  const { broadcastTx } = useBitcoinBroadcastTransaction();
  const utxosOfSpendableInscriptions = useInscribedSpendableUtxos();
  const navigate = useNavigate();

  const isInsufficientBalance = availableBalance.amount.isLessThan(amount.amount);

  const approverActions = useMemo(() => {
    function onCancel() {
      closeWindow();
    }

    async function onApprove() {
      setIsBroadcasting(true);

      function onError(e: unknown) {
        setIsBroadcasting(false);
        logger.error('Error broadcasting tx', e);
        navigate(RouteUrls.SendBtcError, {
          state: {
            error: e,
          },
        });
      }

      try {
        const feeRate = selectedFee?.feeRate;
        if (!feeRate) return logger.error('No fee rate to generate tx');
        const resp = await generateTx({ amount, recipients }, feeRate, utxos);
        if (!resp) return logger.error('Attempted to generate raw tx, but no tx exists');

        const tx = await signTransaction(resp.psbt);

        tx.finalize();

        await broadcastTx({
          tx: tx.hex,
          skipSpendableCheckUtxoIds: utxosOfSpendableInscriptions.map(utxo => utxo.txid),
          async onSuccess(txid) {
            setIsBroadcasting(false);

            void analytics.track('broadcast_transaction', {
              symbol: 'btc',
              amount: amount.amount.toNumber(),
            });

            chrome.tabs.sendMessage(
              tabId ?? 0,
              createRpcSuccessResponse('sendTransfer', {
                id: requestId,
                result: { txid },
              })
            );

            setIsSubmitted(true);
            await delay(500);
            closeWindow();
          },
          onError,
        });
      } catch (error) {
        onError(error);
      } finally {
        setIsBroadcasting(false);
      }
    }

    return getTransactionActions({
      isLoading: isLoadingBalance,
      isError: isInsufficientBalance,
      isBroadcasting,
      isSubmitted,
      onCancel,
      onApprove,
    });
  }, [
    isLoadingBalance,
    isInsufficientBalance,
    isBroadcasting,
    isSubmitted,
    navigate,
    selectedFee?.feeRate,
    generateTx,
    amount,
    recipients,
    utxos,
    signTransaction,
    broadcastTx,
    utxosOfSpendableInscriptions,
    tabId,
    requestId,
  ]);

  return {
    approverActions,
    isBroadcasting,
    isSubmitted,
  };
}

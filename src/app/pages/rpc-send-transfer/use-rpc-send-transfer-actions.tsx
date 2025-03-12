import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useBitcoinBroadcastTransaction } from '@leather.io/query';
import { createRpcSuccessResponse } from '@leather.io/rpc';

import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';
import { closeWindow } from '@shared/utils';
import { analytics } from '@shared/utils/analytics';

import { useGenerateUnsignedNativeSegwitTx } from '@app/common/transactions/bitcoin/use-generate-bitcoin-tx';
import { getApproveTransactionActions } from '@app/components/approve-transaction/get-approve-transaction-actions';
import { useFeeEditorContext } from '@app/features/fee-editor/fee-editor.context';
import { useSignBitcoinTx } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';

import { useRpcSendTransferContext } from './rpc-send-transfer.context';

export function useRpcSendTransferActions() {
  const { availableBalance, selectedFee } = useFeeEditorContext();
  const { amount, isLoading, recipients, requestId, tabId, utxos } = useRpcSendTransferContext();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const generateTx = useGenerateUnsignedNativeSegwitTx({ throwError: true });
  const signTransaction = useSignBitcoinTx();
  const { broadcastTx } = useBitcoinBroadcastTransaction();
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
          },
          onError,
        });
      } catch (error) {
        onError(error);
      } finally {
        setIsBroadcasting(false);
      }
    }

    return getApproveTransactionActions({
      isLoading,
      isInsufficientBalance,
      isBroadcasting,
      isSubmitted,
      onCancel,
      onApprove,
    });
  }, [
    isLoading,
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
    tabId,
    requestId,
  ]);

  return {
    approverActions,
    isBroadcasting,
    isSubmitted,
  };
}

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Money } from '@leather.io/models';
import { type UtxoResponseItem, useBitcoinBroadcastTransaction } from '@leather.io/query';

import { logger } from '@shared/logger';
import type { TransferRecipient } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';
import { makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';
import { closeWindow } from '@shared/utils';
import { analytics } from '@shared/utils/analytics';

import type { FeeDisplayInfo } from '@app/common/fees/use-fees';
import { useGenerateUnsignedNativeSegwitTx } from '@app/common/transactions/bitcoin/use-generate-bitcoin-tx';
import { getApproveActions } from '@app/components/approve-transaction/get-approve-actions';
import { useCurrentBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';
import { useSignBitcoinTx } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';

interface UseSendTransferApproveActionsArgs {
  amountAsMoney: Money;
  recipients: TransferRecipient[];
  utxos: UtxoResponseItem[];
  selectedFeeData: FeeDisplayInfo;
  requestId: string;
  tabId: number | null;
}

export function useSendTransferApproveActions({
  amountAsMoney,
  recipients,
  utxos,
  selectedFeeData,
  requestId,
  tabId,
}: UseSendTransferApproveActionsArgs) {
  const navigate = useNavigate();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const generateTx = useGenerateUnsignedNativeSegwitTx({ throwError: true });
  const signTransaction = useSignBitcoinTx();
  const btcBalance = useCurrentBtcCryptoAssetBalanceNativeSegwit();
  const { broadcastTx } = useBitcoinBroadcastTransaction();

  const isLoading = btcBalance.isLoadingAllData;

  const isInsufficientBalance = btcBalance.balance.availableBalance.amount.isLessThan(
    amountAsMoney.amount
  );

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
        const feeRate = selectedFeeData.feeRate;
        const resp = await generateTx({ amount: amountAsMoney, recipients }, feeRate, utxos);

        if (!resp) return logger.error('Attempted to generate raw tx, but no tx exists');

        const tx = await signTransaction(resp.psbt);

        tx.finalize();

        await broadcastTx({
          tx: tx.hex,
          async onSuccess(txid) {
            setIsBroadcasting(false);

            void analytics.track('broadcast_transaction', {
              symbol: 'btc',
              amount: amountAsMoney.amount.toNumber(),
            });

            chrome.tabs.sendMessage(
              tabId ?? 0,
              makeRpcSuccessResponse('sendTransfer', {
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

    return getApproveActions({
      isLoading,
      isInsufficientBalance,
      isBroadcasting,
      isSubmitted,
      onCancel,
      onApprove,
    });
  }, [
    amountAsMoney,
    broadcastTx,
    generateTx,
    isLoading,
    isInsufficientBalance,
    isBroadcasting,
    isSubmitted,
    navigate,
    recipients,
    requestId,
    selectedFeeData.feeRate,
    signTransaction,
    tabId,
    utxos,
  ]);

  return {
    approverActions,
    isBroadcasting,
    isSubmitted,
  };
}

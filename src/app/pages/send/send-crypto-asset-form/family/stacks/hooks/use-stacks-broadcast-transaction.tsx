import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import {
  StacksTransaction,
  TokenTransferPayload,
  addressToString,
  deserializeTransaction,
} from '@stacks/transactions';
import { microStxToStx } from '@stacks/ui-utils';

import { logger } from '@shared/logger';
import { createMoney } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';
import { isString } from '@shared/utils';

import { useHomeTabs } from '@app/common/hooks/use-home-tabs';
import { LoadingKeys } from '@app/common/hooks/use-loading';
import { useSubmitTransactionCallback } from '@app/common/hooks/use-submit-stx-transaction';
import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { formatMoney, i18nFormatCurrency } from '@app/common/money/format-money';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';
import { useStacksBlockTime } from '@app/query/stacks/info/info.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';
import { useSignTransactionSoftwareWallet } from '@app/store/transactions/transaction.hooks';

import { convertToMoneyTypeWithDefaultOfZero } from '../../../components/confirmation/send-form-confirmation.utils';

export function useStacksBroadcastTransaction(unsignedTx: string) {
  const { setActiveTabActivity } = useHomeTabs();
  const signSoftwareWalletTx = useSignTransactionSoftwareWallet();
  const stxMarketData = useCryptoCurrencyMarketData('STX');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const navigate = useNavigate();

  const broadcastTransactionFn = useSubmitTransactionCallback({
    loadingKey: LoadingKeys.CONFIRM_DRAWER,
  });
  const { data: blockTime } = useStacksBlockTime();
  const { isTestnet } = useCurrentNetworkState();

  return useMemo(() => {
    function handlePreviewClose() {
      navigate(RouteUrls.Home);
      void setActiveTabActivity();
    }

    function handlePreviewSuccess(txId: string, signedTx: StacksTransaction) {
      navigate(
        RouteUrls.SentStxTxSummary.replace(':txId', `${txId}`),
        formSentSummaryTxState(txId, signedTx)
      );
    }

    function formSentSummaryTxState(txId: string, signedTx: StacksTransaction) {
      return {
        state: {
          hasHeaderTitle: true,
          txLink: {
            blockchain: 'stacks',
            txid: txId || '',
          },
          txId,
          ...formReviewTxSummary(signedTx),
        },
      };
    }

    function formReviewTxSummary(tx: StacksTransaction) {
      const payload = tx.payload as TokenTransferPayload;
      const txValue = payload.amount;
      const fee = tx.auth.spendingCondition.fee;
      const memoContent = payload?.memo?.content ?? '';
      const memoDisplayText = removeTrailingNullCharacters(memoContent) || 'No memo';

      return {
        recipient: addressToString(payload.recipient.address),
        fee: formatMoney(convertToMoneyTypeWithDefaultOfZero('STX', Number(fee))),
        totalSpend: formatMoney(convertToMoneyTypeWithDefaultOfZero('STX', Number(txValue + fee))),
        arrivesIn: getArrivesInTime(),
        symbol: 'STX',
        txValue: microStxToStx(Number(txValue)),
        sendingValue: formatMoney(convertToMoneyTypeWithDefaultOfZero('STX', Number(txValue))),
        txFiatValue: i18nFormatCurrency(
          baseCurrencyAmountInQuote(createMoney(Number(payload.amount), 'STX'), stxMarketData)
        ),
        nonce: String(tx.auth.spendingCondition.nonce),
        memoDisplayText,
      };
    }

    function getArrivesInTime() {
      let arrivesIn = isTestnet
        ? blockTime?.testnet.target_block_time
        : blockTime?.mainnet.target_block_time;
      if (!arrivesIn) {
        return '~10 – 20 min';
      }

      arrivesIn = arrivesIn / 60;
      return `~${arrivesIn} min`;
    }

    function removeTrailingNullCharacters(s: string) {
      return s.replace(/\0*$/g, '');
    }

    async function broadcastTransactionAction(signedTx: StacksTransaction) {
      if (!signedTx) {
        logger.error('Cannot broadcast transaction, no tx in state');
        toast.error('Unable to broadcast transaction');
        return;
      }
      try {
        setIsBroadcasting(true);
        await broadcastTransactionFn({
          onError(e: Error | string) {
            handlePreviewClose();
            const message = isString(e) ? e : e.message;
            navigate(RouteUrls.TransactionBroadcastError, { state: { message } });
          },
          onSuccess(txId) {
            handlePreviewSuccess(txId, signedTx);
          },
          replaceByFee: false,
        })(signedTx);
      } catch (e) {
        handlePreviewClose();
        navigate(RouteUrls.TransactionBroadcastError, {
          state: { message: e instanceof Error ? e.message : 'unknown error' },
        });
      } finally {
        setIsBroadcasting(false);
      }
    }

    async function broadcastTransaction(unsignedTx: StacksTransaction) {
      if (!unsignedTx) return;
      const signedTx = signSoftwareWalletTx(unsignedTx);
      if (!signedTx) return;
      await broadcastTransactionAction(signedTx);
    }

    const deserializedTransaction = deserializeTransaction(unsignedTx);

    return {
      stacksDeserializedTransaction: deserializedTransaction,
      stacksBroadcastTransaction: broadcastTransaction,
      formReviewTxSummary,
      isBroadcasting,
    };
  }, [
    broadcastTransactionFn,
    navigate,
    setActiveTabActivity,
    signSoftwareWalletTx,
    unsignedTx,
    stxMarketData,
    blockTime,
    isTestnet,
    isBroadcasting,
  ]);
}

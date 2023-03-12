import { useMemo } from 'react';
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
        formSummaryTxState(txId, signedTx)
      );
    }

    function formSummaryTxState(txId: string, signedTx: StacksTransaction) {
      const payload = signedTx.payload as TokenTransferPayload;
      const txValue = payload.amount;
      const fee = signedTx.auth.spendingCondition.fee;

      return {
        state: {
          txLink: {
            blockchain: 'stacks',
            txid: txId || '',
          },
          recipient: addressToString(payload.recipient.address),
          fee: formatMoney(convertToMoneyTypeWithDefaultOfZero('STX', Number(fee))),
          totalBalance: formatMoney(
            convertToMoneyTypeWithDefaultOfZero('STX', Number(txValue + fee))
          ),
          arrivesIn: getArrivesInTime(),
          symbol: 'STX',
          txValue: microStxToStx(Number(txValue)),
          sendingValue: formatMoney(convertToMoneyTypeWithDefaultOfZero('STX', Number(txValue))),
          txId,
          txFiatValue: i18nFormatCurrency(
            baseCurrencyAmountInQuote(createMoney(Number(payload.amount), 'STX'), stxMarketData)
          ),
        },
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

    async function broadcastTransactionAction(signedTx: StacksTransaction) {
      if (!signedTx) {
        logger.error('Cannot broadcast transaction, no tx in state');
        toast.error('Unable to broadcast transaction');
        return;
      }
      try {
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
  ]);
}

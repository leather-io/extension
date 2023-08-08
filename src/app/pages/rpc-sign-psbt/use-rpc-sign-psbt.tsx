import { useNavigate } from 'react-router-dom';

import { RpcErrorCode } from '@btckit/types';
import { bytesToHex } from '@stacks/common';

import { Money } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';
import { makeRpcErrorResponse, makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { sumMoney } from '@app/common/money/calculate-money';
import { formatMoney, formatMoneyPadded, i18nFormatCurrency } from '@app/common/money/format-money';
import { SignPsbtArgs } from '@app/common/psbt/requests';
import { useRpcSignPsbtParams } from '@app/common/psbt/use-psbt-request-params';
import { usePsbtSigner } from '@app/features/psbt-signer/hooks/use-psbt-signer';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { useBitcoinBroadcastTransaction } from '@app/query/bitcoin/transaction/use-bitcoin-broadcast-transaction';
import {
  useCalculateBitcoinFiatValue,
  useCryptoCurrencyMarketData,
} from '@app/query/common/market-data/market-data.hooks';

interface BroadcastSignedPsbtTxArgs {
  addressNativeSegwitTotal: Money;
  addressTaprootTotal: Money;
  fee: Money;
  tx: string;
}

export function useRpcSignPsbt() {
  const analytics = useAnalytics();
  const navigate = useNavigate();
  // const { addressNativeSegwitTotal, addressTaprootTotal, fee } = usePsbtSignerContext();
  const { allowedSighash, broadcast, origin, psbtHex, requestId, signAtIndex, tabId } =
    useRpcSignPsbtParams();
  const { signPsbt, getPsbtAsTransaction } = usePsbtSigner();
  const { broadcastTx, isBroadcasting } = useBitcoinBroadcastTransaction();
  const { refetch } = useCurrentNativeSegwitUtxos();
  const btcMarketData = useCryptoCurrencyMarketData('BTC');
  const calculateBitcoinFiatValue = useCalculateBitcoinFiatValue();

  if (!requestId || !psbtHex || !origin) throw new Error('Invalid params');

  async function broadcastSignedPsbtTx({
    addressNativeSegwitTotal,
    addressTaprootTotal,
    fee,
    tx,
  }: BroadcastSignedPsbtTxArgs) {
    void analytics.track('user_approved_sign_and_broadcast_psbt', { origin });

    const transferTotalAsMoney = sumMoney([addressNativeSegwitTotal, addressTaprootTotal]);

    await broadcastTx({
      tx,
      async onSuccess(txid) {
        await refetch();

        const psbtTxSummaryState = {
          fee: formatMoneyPadded(fee),
          hasHeaderTitle: true,
          sendingValue: formatMoney(transferTotalAsMoney),
          totalSpend: formatMoney(sumMoney([transferTotalAsMoney, fee])),
          txFiatValue: i18nFormatCurrency(calculateBitcoinFiatValue(transferTotalAsMoney)),
          txFiatValueSymbol: btcMarketData.price.symbol,
          txId: txid,
          txLink: {
            blockchain: 'bitcoin',
            txid: txid || '',
          },
          txValue: formatMoney(transferTotalAsMoney),
        };

        navigate(RouteUrls.RpcSignPsbtSummary, {
          state: psbtTxSummaryState,
        });
      },
      onError(e) {
        navigate(RouteUrls.RequestError, {
          state: { message: e instanceof Error ? e.message : '', title: 'Failed to broadcast' },
        });
      },
    });
  }

  return {
    allowedSighash,
    indexesToSign: signAtIndex,
    isBroadcasting,
    origin,
    psbtHex,
    async onSignPsbt({ addressNativeSegwitTotal, addressTaprootTotal, fee, inputs }: SignPsbtArgs) {
      const tx = getPsbtAsTransaction(psbtHex);

      try {
        signPsbt({ allowedSighash, indexesToSign: signAtIndex, inputs, tx });
      } catch (e) {
        return navigate(RouteUrls.RequestError, {
          state: { message: e instanceof Error ? e.message : '', title: 'Failed to sign' },
        });
      }

      const psbt = tx.toPSBT();

      chrome.tabs.sendMessage(
        tabId,
        makeRpcSuccessResponse('signPsbt', { id: requestId, result: { hex: bytesToHex(psbt) } })
      );

      // Optional args are handle bc we support two request apis,
      // but only support broadcasting using the rpc request method
      if (broadcast && addressNativeSegwitTotal && addressTaprootTotal && fee) {
        tx.finalize();
        await broadcastSignedPsbtTx({
          addressNativeSegwitTotal,
          addressTaprootTotal,
          fee,
          tx: tx.hex,
        });
        return;
      }

      window.close();
    },
    onCancel() {
      chrome.tabs.sendMessage(
        tabId,
        makeRpcErrorResponse('signPsbt', {
          id: requestId,
          error: {
            message: 'User denied signing',
            code: RpcErrorCode.USER_REJECTION,
          },
        })
      );
      window.close();
    },
  };
}

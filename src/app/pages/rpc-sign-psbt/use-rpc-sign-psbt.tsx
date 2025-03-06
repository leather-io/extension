import { useNavigate } from 'react-router-dom';

import { hexToBytes } from '@noble/hashes/utils';
import { bytesToHex } from '@stacks/common';

import type { Money } from '@leather.io/models';
import {
  useBitcoinBroadcastTransaction,
  useCalculateBitcoinFiatValue,
  useCryptoCurrencyMarketDataMeanAverage,
} from '@leather.io/query';
import { RpcErrorCode, createRpcErrorResponse, createRpcSuccessResponse } from '@leather.io/rpc';
import {
  formatMoney,
  formatMoneyPadded,
  i18nFormatCurrency,
  isError,
  sumMoney,
} from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';
import { closeWindow } from '@shared/utils';
import { analytics } from '@shared/utils/analytics';

import { SignPsbtArgs } from '@app/common/psbt/requests';
import { useRpcSignPsbtParams } from '@app/common/psbt/use-psbt-request-params';
import { usePsbtSigner } from '@app/features/psbt-signer/hooks/use-psbt-signer';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { useGetAssumedZeroIndexSigningConfig } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';

interface BroadcastSignedPsbtTxArgs {
  addressNativeSegwitTotal: Money;
  addressTaprootTotal: Money;
  fee: Money;
  tx: string;
  psbt: string;
}
export function useRpcSignPsbt() {
  const navigate = useNavigate();
  const { broadcast, origin, psbtHex, requestId, signAtIndex, tabId } = useRpcSignPsbtParams();
  const { signPsbt, getPsbtAsTransaction } = usePsbtSigner();
  const { broadcastTx, isBroadcasting } = useBitcoinBroadcastTransaction();
  const { filteredUtxosQuery } = useCurrentNativeSegwitUtxos();
  const btcMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');
  const calculateBitcoinFiatValue = useCalculateBitcoinFiatValue();
  const getDefaultSigningConfig = useGetAssumedZeroIndexSigningConfig();

  if (!requestId || !psbtHex || !origin) throw new Error('Invalid params in useRpcSignPsbt');

  async function broadcastSignedPsbtTx({
    addressNativeSegwitTotal,
    addressTaprootTotal,
    fee,
    tx,
    psbt,
  }: BroadcastSignedPsbtTxArgs) {
    void analytics.track('user_approved_sign_and_broadcast_psbt', {
      origin: origin || 'no_origin',
    });

    const transferTotalAsMoney = sumMoney([addressNativeSegwitTotal, addressTaprootTotal]);

    return await broadcastTx({
      tx,
      // skip utxos check for psbt txs
      skipSpendableCheckUtxoIds: 'all',
      async onSuccess(txid) {
        if (!requestId) throw new Error('Invalid request id');

        chrome.tabs.sendMessage(
          tabId,
          createRpcSuccessResponse('signPsbt', {
            id: requestId,
            result: { hex: psbt, txid },
          })
        );

        await filteredUtxosQuery.refetch();

        const psbtTxSummaryState = {
          fee: formatMoneyPadded(fee),
          sendingValue: formatMoney(transferTotalAsMoney),
          totalSpend: formatMoney(sumMoney([transferTotalAsMoney, fee])),
          txFiatValue: i18nFormatCurrency(calculateBitcoinFiatValue(transferTotalAsMoney)),
          txFiatValueSymbol: btcMarketData.price.symbol,
          txId: txid,
          txLink: {
            blockchain: 'bitcoin',
            txId: txid || '',
          },
          txValue: formatMoney(transferTotalAsMoney),
        };

        navigate(RouteUrls.RpcSignPsbtSummary, { state: psbtTxSummaryState });
      },
      onError(e) {
        if (!requestId) throw new Error('Invalid request id');

        chrome.tabs.sendMessage(
          tabId,
          createRpcErrorResponse('signPsbt', {
            id: requestId,
            error: { code: 4002, message: 'Failed to broadcast transaction' },
          })
        );
        navigate(RouteUrls.RequestError, {
          state: { message: isError(e) ? e.message : '', title: 'Failed to broadcast' },
        });
      },
    });
  }

  return {
    indexesToSign: signAtIndex,
    isBroadcasting,
    origin,
    psbtHex,
    async onSignPsbt({ addressNativeSegwitTotal, addressTaprootTotal, fee }: SignPsbtArgs) {
      const tx = getPsbtAsTransaction(psbtHex);

      try {
        const signedTx = await signPsbt({
          tx,
          signingConfig: getDefaultSigningConfig(hexToBytes(psbtHex), signAtIndex),
        });

        const psbt = signedTx.toPSBT();

        if (!broadcast) {
          chrome.tabs.sendMessage(
            tabId,
            createRpcSuccessResponse('signPsbt', {
              id: requestId,
              result: { hex: bytesToHex(psbt) },
            })
          );
          closeWindow();
          return;
        }

        // Optional args are handled here bc we support two request apis,
        // but we only support broadcasting using the rpc request method
        if (broadcast && addressNativeSegwitTotal && addressTaprootTotal && fee) {
          try {
            signedTx.finalize();

            await broadcastSignedPsbtTx({
              addressNativeSegwitTotal,
              addressTaprootTotal,
              fee,
              tx: signedTx.hex,
              psbt: bytesToHex(psbt),
            });
          } catch (e) {
            return navigate(RouteUrls.RequestError, {
              state: {
                message: isError(e) ? e.message : '',
                title: 'Failed to finalize tx',
              },
            });
          }

          return;
        }
      } catch (e) {
        return navigate(RouteUrls.RequestError, {
          state: { message: isError(e) ? e.message : '', title: 'Failed to sign' },
        });
      }
    },
    onCancel() {
      chrome.tabs.sendMessage(
        tabId,
        createRpcErrorResponse('signPsbt', {
          id: requestId,
          error: {
            code: RpcErrorCode.USER_REJECTION,
            message: 'User rejected signing PSBT request',
          },
        })
      );
      closeWindow();
    },
  };
}

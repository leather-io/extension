import { Outlet, useNavigate } from 'react-router';

import { RouteUrls } from '@shared/route-urls';

import { BitcoinUtxosLoader } from '@app/components/loaders/bitcoin-utxos-loader';
import { BitcoinFeeEditorProvider } from '@app/features/fee-editor/bitcoin/bitcoin-fee-editor.provider';
import { useCurrentNativeSegwitBtcBalanceWithFallback } from '@app/query/bitcoin/balance/btc-balance.hooks';
import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';

import { RpcSendTransferProvider } from './rpc-send-transfer.context';
import { useRpcSendTransfer } from './use-rpc-send-transfer';

export function RpcSendTransferContainer() {
  const sendTransferState = useRpcSendTransfer();
  const btcMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');
  const { isLoading: isLoadingBalance, btc: btcBalance } =
    useCurrentNativeSegwitBtcBalanceWithFallback();

  const navigate = useNavigate();

  const { recipients, amount } = sendTransferState;

  return (
    <BitcoinUtxosLoader>
      {utxos => (
        <BitcoinFeeEditorProvider
          amount={amount}
          availableBalance={btcBalance.availableBalance}
          isSendingMax={false}
          marketData={btcMarketData}
          onGoBack={() => navigate(RouteUrls.RpcSendTransfer)}
          recipients={recipients}
          utxos={utxos}
        >
          <RpcSendTransferProvider
            value={{
              ...sendTransferState,
              isLoadingBalance,
              utxos,
            }}
          >
            <Outlet />
          </RpcSendTransferProvider>
        </BitcoinFeeEditorProvider>
      )}
    </BitcoinUtxosLoader>
  );
}

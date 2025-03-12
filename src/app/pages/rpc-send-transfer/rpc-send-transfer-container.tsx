import { Outlet, useNavigate } from 'react-router-dom';

import { useCryptoCurrencyMarketDataMeanAverage } from '@leather.io/query';

import { RouteUrls } from '@shared/route-urls';

import { useSwitchAccountSheet } from '@app/common/switch-account/use-switch-account-sheet-context';
import { BitcoinUtxosLoader } from '@app/components/loaders/bitcoin-utxos-loader';
import { BitcoinFeeEditorProvider } from '@app/features/fee-editor/bitcoin/bitcoin-fee-editor.provider';
import { useCurrentBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';

import { type RpcSendTransferContext, RpcSendTransferProvider } from './rpc-send-transfer.context';
import { useRpcSendTransfer } from './use-rpc-send-transfer';

export function RpcSendTransferContainer() {
  const sendTransferState = useRpcSendTransfer();
  const { toggleSwitchAccount } = useSwitchAccountSheet();
  const btcMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');
  const btcBalance = useCurrentBtcCryptoAssetBalanceNativeSegwit();
  const navigate = useNavigate();

  const { recipients, amount } = sendTransferState;

  const rpcSendTransferContext: RpcSendTransferContext = {
    isLoading: btcBalance.isLoadingAllData,
    onUserActivatesFeeEditor: () => navigate(RouteUrls.EditFee),
    onUserActivatesSwitchAccount: toggleSwitchAccount,
    utxos: [],
    ...sendTransferState,
  };

  return (
    <BitcoinUtxosLoader>
      {utxos => (
        <BitcoinFeeEditorProvider
          amount={amount}
          availableBalance={btcBalance.balance.availableBalance}
          isSendingMax={false}
          marketData={btcMarketData}
          onGoBack={() => navigate(RouteUrls.RpcSendTransfer)}
          recipients={recipients}
          utxos={utxos}
        >
          <RpcSendTransferProvider
            value={{
              ...rpcSendTransferContext,
              isLoading: btcBalance.isLoadingAllData,
              onUserActivatesFeeEditor: () => navigate(RouteUrls.EditFee),
              onUserActivatesSwitchAccount: toggleSwitchAccount,
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

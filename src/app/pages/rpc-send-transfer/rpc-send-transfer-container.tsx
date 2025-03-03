import { Outlet, useNavigate } from 'react-router-dom';

import { useCryptoCurrencyMarketDataMeanAverage } from '@leather.io/query';

import { RouteUrls } from '@shared/route-urls';

import { useSwitchAccountSheet } from '@app/common/switch-account/use-switch-account-sheet-context';
import { useBitcoinFees } from '@app/features/fee-editor/bitcoin/use-bitcoin-fees';
import { FeeEditorProvider } from '@app/features/fee-editor/fee-editor.context';
import { useFeeEditor } from '@app/features/fee-editor/use-fee-editor';
import { useCurrentBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';

import { type RpcSendTransferContext, RpcSendTransferProvider } from './rpc-send-transfer.context';
import { useRpcSendTransfer } from './use-rpc-send-transfer';

export function RpcSendTransferContainer() {
  const sendTransferState = useRpcSendTransfer();
  const { toggleSwitchAccount } = useSwitchAccountSheet();
  const btcMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');
  const btcBalance = useCurrentBtcCryptoAssetBalanceNativeSegwit();
  const navigate = useNavigate();

  const { recipients, utxos, amountAsMoney } = sendTransferState;

  const {
    editorFees,
    getCustomEditorFee,
    isLoading: isLoadingFees,
  } = useBitcoinFees({
    amount: amountAsMoney,
    recipients,
    utxos,
  });

  const feeEditorContext = useFeeEditor({
    editorFees,
    getCustomEditorFee,
  });

  const rpcSendTransferContext: RpcSendTransferContext = {
    isLoading: btcBalance.isLoadingAllData,
    onUserActivatesFeeEditor: () => navigate(RouteUrls.EditFee),
    onUserActivatesSwitchAccount: toggleSwitchAccount,
    ...sendTransferState,
  };

  return (
    <FeeEditorProvider
      value={{
        ...feeEditorContext,
        isLoadingFees,
        availableBalance: btcBalance.balance.availableBalance,
        marketData: btcMarketData,
      }}
    >
      <RpcSendTransferProvider value={rpcSendTransferContext}>
        <Outlet />
      </RpcSendTransferProvider>
    </FeeEditorProvider>
  );
}

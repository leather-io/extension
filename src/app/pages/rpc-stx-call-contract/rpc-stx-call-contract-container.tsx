import { Outlet, useNavigate } from 'react-router-dom';

import {
  useCryptoCurrencyMarketDataMeanAverage,
  useStxCryptoAssetBalance,
} from '@leather.io/query';
import { stxCallContract } from '@leather.io/rpc';

import { RouteUrls } from '@shared/route-urls';

import { useRpcSip30BroadcastTransaction } from '@app/common/rpc/use-rpc-sip30-broadcast-transaction';
import { StacksNonceLoader } from '@app/components/loaders/stacks-nonce-loader';
import { StacksFeeEditorProvider } from '@app/features/fee-editor/stacks/stacks-fee-editor.provider';
import { NonceEditorProvider } from '@app/features/nonce-editor/nonce-editor.context';
import { useBreakOnNonCompliantEntity } from '@app/query/common/compliance-checker/compliance-checker.query';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { RpcCallContractProvider } from './rpc-stx-call-contract.context';

export function RpcStxCallContractContainer() {
  const navigate = useNavigate();
  const stxMarketData = useCryptoCurrencyMarketDataMeanAverage('STX');
  const stxAddress = useCurrentStacksAccountAddress();
  const { filteredBalanceQuery } = useStxCryptoAssetBalance(stxAddress);
  const availableBalance = filteredBalanceQuery.data?.availableUnlockedBalance;
  const { onSignStacksTransaction, stacksTransaction, txSender } = useRpcSip30BroadcastTransaction(
    stxCallContract.method
  );

  useBreakOnNonCompliantEntity(txSender);

  // Handle these better?
  if (!availableBalance || !stacksTransaction) return null;

  return (
    <StacksNonceLoader>
      {nonce => (
        <StacksFeeEditorProvider
          availableBalance={availableBalance}
          marketData={stxMarketData}
          onGoBack={() => navigate(RouteUrls.RpcStxCallContract)}
          unsignedTx={stacksTransaction}
        >
          <NonceEditorProvider value={{ nonce }}>
            <RpcCallContractProvider
              value={{
                unsignedTx: stacksTransaction,
                onSignStacksTransaction,
                onUserActivatesFeeEditor: () => navigate(RouteUrls.EditFee),
              }}
            >
              <Outlet />
            </RpcCallContractProvider>
          </NonceEditorProvider>
        </StacksFeeEditorProvider>
      )}
    </StacksNonceLoader>
  );
}

import { Outlet, useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { StacksNonceLoader } from '@app/components/loaders/stacks-nonce-loader';
import { StxBalanceLoader } from '@app/components/loaders/stx-balance-loader';
import { StacksFeeEditorProvider } from '@app/features/fee-editor/stacks/stacks-fee-editor.provider';
import { NonceEditorProvider } from '@app/features/nonce-editor/nonce-editor.provider';
import { useRpcTransactionRequest } from '@app/features/rpc-transaction-request/use-rpc-transaction-request';
import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { RpcStxCallContractProvider } from './rpc-stx-call-contract.context';
import { useRpcStxCallContractTxOptions } from './use-rpc-stx-call-contract';

export function RpcStxCallContractContainer() {
  const request = useRpcTransactionRequest();
  const stxMarketData = useCryptoCurrencyMarketDataMeanAverage('STX');
  const stxAddress = useCurrentStacksAccountAddress();
  const txOptions = useRpcStxCallContractTxOptions();
  const navigate = useNavigate();

  return (
    <StxBalanceLoader address={stxAddress}>
      {(balance, isLoadingAdditionalData) => (
        <StacksNonceLoader>
          {nonce => (
            <StacksFeeEditorProvider
              availableBalance={balance.availableBalance}
              marketData={stxMarketData}
              onGoBack={() => navigate(RouteUrls.RpcStxCallContract)}
              txOptions={{ ...txOptions, nonce }}
            >
              <NonceEditorProvider
                nonce={nonce}
                onGoBack={() => navigate(RouteUrls.RpcStxCallContract)}
              >
                <RpcStxCallContractProvider
                  value={{
                    ...request,
                    isLoadingBalance: isLoadingAdditionalData,
                    txOptions,
                  }}
                >
                  <Outlet />
                </RpcStxCallContractProvider>
              </NonceEditorProvider>
            </StacksFeeEditorProvider>
          )}
        </StacksNonceLoader>
      )}
    </StxBalanceLoader>
  );
}

import { Outlet, useNavigate } from 'react-router-dom';

import { stxCallContract } from '@leather.io/rpc';

import { RouteUrls } from '@shared/route-urls';

import { StacksNonceLoader } from '@app/components/loaders/stacks-nonce-loader';
import { StxBalanceLoader } from '@app/components/loaders/stx-balance-loader';
import { StacksFeeEditorProvider } from '@app/features/fee-editor/stacks/stacks-fee-editor.provider';
import { NonceEditorProvider } from '@app/features/nonce-editor/nonce-editor.provider';
import { RpcTransactionRequestProvider } from '@app/features/rpc-transaction-request/rpc-transaction-request-provider';
import type { RpcCallContractRequestContext } from '@app/features/rpc-transaction-request/rpc-transaction-request.context';
import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { useRpcStxCallContractTxOptions } from './use-rpc-stx-call-contract';

export function RpcStxCallContractContainer() {
  const navigate = useNavigate();
  const stxMarketData = useCryptoCurrencyMarketDataMeanAverage('STX');
  const stxAddress = useCurrentStacksAccountAddress();
  const txOptions = useRpcStxCallContractTxOptions();

  return (
    <StxBalanceLoader address={stxAddress}>
      {(balance, isLoadingAdditionalData) => (
        <StacksNonceLoader>
          {nonce => (
            <StacksFeeEditorProvider
              availableBalance={balance.availableBalance}
              marketData={stxMarketData}
              onGoBack={() => navigate(RouteUrls.RpcStxCallContract)}
              txOptions={txOptions}
            >
              <NonceEditorProvider
                nonce={nonce}
                onGoBack={() => navigate(RouteUrls.RpcStxCallContract)}
              >
                <RpcTransactionRequestProvider<RpcCallContractRequestContext>
                  isLoadingData={isLoadingAdditionalData}
                  method={stxCallContract.method}
                  requestData={{ txOptions }}
                >
                  <Outlet />
                </RpcTransactionRequestProvider>
              </NonceEditorProvider>
            </StacksFeeEditorProvider>
          )}
        </StacksNonceLoader>
      )}
    </StxBalanceLoader>
  );
}

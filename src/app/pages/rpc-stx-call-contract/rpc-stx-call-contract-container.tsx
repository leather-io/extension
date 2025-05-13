import { Outlet, useNavigate } from 'react-router-dom';

import { isDefined } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';

import { StacksNonceLoader } from '@app/components/loaders/stacks-nonce-loader';
import { StxBalanceLoader } from '@app/components/loaders/stx-balance-loader';
import { StacksFeeEditorProvider } from '@app/features/fee-editor/stacks/stacks-fee-editor.provider';
import { NonceEditorProvider } from '@app/features/nonce-editor/nonce-editor.provider';
import { useRpcTransactionRequest } from '@app/features/rpc-transaction-request/use-rpc-transaction-request';
import { useBreakOnNonCompliantEntity } from '@app/query/common/compliance-checker/compliance-checker.query';
import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';
import type { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';
import { useCurrentStacksNetworkState } from '@app/store/networks/networks.hooks';

import { RpcStxCallContractProvider } from './rpc-stx-call-contract.context';
import {
  getDecodedRpcStxCallContractRequest,
  getUnsignedStacksContractCallOptionsForFeeEstimation,
} from './rpc-stx-call-contract.utils';

interface RpcStxCallContractContainerProps {
  account: StacksAccount;
}
export function RpcStxCallContractContainer({ account }: RpcStxCallContractContainerProps) {
  const request = useRpcTransactionRequest();
  const network = useCurrentStacksNetworkState();
  const stxMarketData = useCryptoCurrencyMarketDataMeanAverage('STX');
  const navigate = useNavigate();

  const rpcRequest = getDecodedRpcStxCallContractRequest();
  const txOptionsForFeeEstimation = getUnsignedStacksContractCallOptionsForFeeEstimation({
    publicKey: account.stxPublicKey,
    network,
  });

  useBreakOnNonCompliantEntity([account.address].filter(isDefined));

  return (
    <StxBalanceLoader address={account.address}>
      {(balance, isLoadingAdditionalData) => (
        <StacksNonceLoader>
          {nonce => (
            <StacksFeeEditorProvider
              availableBalance={balance.availableBalance}
              marketData={stxMarketData}
              onGoBack={() => navigate(RouteUrls.RpcStxCallContract)}
              txOptions={{ ...txOptionsForFeeEstimation, nonce }}
            >
              <NonceEditorProvider
                nonce={nonce}
                onGoBack={() => navigate(RouteUrls.RpcStxCallContract)}
              >
                <RpcStxCallContractProvider
                  value={{
                    ...request,
                    isLoadingBalance: isLoadingAdditionalData,
                    publicKey: account.stxPublicKey,
                    rpcRequest,
                    network,
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

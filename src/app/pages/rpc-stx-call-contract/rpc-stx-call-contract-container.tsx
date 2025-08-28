import { useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router';

import { stxCallContract } from '@leather.io/rpc';
import { isDefined } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';

import { getTxSenderAddress } from '@app/common/transactions/stacks/transaction.utils';
import { StacksNonceLoader } from '@app/components/loaders/stacks-nonce-loader';
import { StxBalanceLoader } from '@app/components/loaders/stx-balance-loader';
import { StacksFeeEditorProvider } from '@app/features/fee-editor/stacks/stacks-fee-editor.provider';
import { NonceEditorProvider } from '@app/features/nonce-editor/nonce-editor.provider';
import { StacksRpcTransactionRequestProvider } from '@app/features/rpc-stacks-transaction-request/stacks/stacks-rpc-transaction-request.context';
import { useUnsignedStacksTransactionForFeeEstimation } from '@app/features/rpc-stacks-transaction-request/stacks/use-unsigned-transaction-for-fee-estimation';
import { useRpcTransactionRequest } from '@app/features/rpc-stacks-transaction-request/use-rpc-transaction-request';
import { useBreakOnNonCompliantEntity } from '@app/query/common/compliance-checker/compliance-checker.query';
import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';
import type { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';
import { useCurrentStacksNetworkState } from '@app/store/networks/networks.hooks';

import { getUnsignedStacksContractCallOptionsForFeeEstimation } from './rpc-stx-call-contract.utils';

interface RpcStxCallContractContainerProps {
  account: StacksAccount;
}
export function RpcStxCallContractContainer({ account }: RpcStxCallContractContainerProps) {
  const request = useRpcTransactionRequest();
  const network = useCurrentStacksNetworkState();
  const stxMarketData = useCryptoCurrencyMarketDataMeanAverage('STX');
  const navigate = useNavigate();

  const txOptionsForFeeEstimation = useMemo(
    () =>
      getUnsignedStacksContractCallOptionsForFeeEstimation({
        publicKey: account.stxPublicKey,
        network,
      }),
    [account.stxPublicKey, network]
  );

  const unsignedTxForFeeEstimation = useUnsignedStacksTransactionForFeeEstimation({
    method: stxCallContract.method,
    request,
    txOptions: txOptionsForFeeEstimation,
  });

  const txSenderAddress = unsignedTxForFeeEstimation
    ? getTxSenderAddress(unsignedTxForFeeEstimation)
    : account.address;

  useBreakOnNonCompliantEntity([txSenderAddress].filter(isDefined));

  if (!unsignedTxForFeeEstimation) return null;

  return (
    <>
      <StxBalanceLoader address={account.address}>
        {(balance, isLoadingAdditionalData) => (
          <StacksNonceLoader>
            {nonceCalc => (
              <StacksFeeEditorProvider
                availableBalance={balance.availableBalance}
                marketData={stxMarketData}
                onGoBack={() => navigate(RouteUrls.RpcStxCallContract)}
                unsignedTx={unsignedTxForFeeEstimation}
              >
                <NonceEditorProvider
                  nonce={nonceCalc.nonce}
                  onGoBack={() => navigate(RouteUrls.RpcStxCallContract)}
                >
                  <StacksRpcTransactionRequestProvider
                    value={{
                      ...request,
                      isLoadingBalance: isLoadingAdditionalData,
                      address: account.address,
                      publicKey: account.stxPublicKey,
                      network,
                    }}
                  >
                    <Outlet />
                  </StacksRpcTransactionRequestProvider>
                </NonceEditorProvider>
              </StacksFeeEditorProvider>
            )}
          </StacksNonceLoader>
        )}
      </StxBalanceLoader>
    </>
  );
}

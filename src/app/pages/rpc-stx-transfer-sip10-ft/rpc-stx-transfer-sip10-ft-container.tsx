import { useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { stxTransferSip10Ft } from '@leather.io/rpc';
import { isDefined } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';

import { useSwitchAccountSheet } from '@app/common/switch-account/use-switch-account-sheet-context';
import { getTxSenderAddress } from '@app/common/transactions/stacks/transaction.utils';
import { StacksNonceLoader } from '@app/components/loaders/stacks-nonce-loader';
import { StxBalanceLoader } from '@app/components/loaders/stx-balance-loader';
import { StacksFeeEditorProvider } from '@app/features/fee-editor/stacks/stacks-fee-editor.provider';
import { NonceEditorProvider } from '@app/features/nonce-editor/nonce-editor.provider';
import { StacksRpcTransactionRequestProvider } from '@app/features/rpc-transaction-request/stacks/stacks-rpc-transaction-request.context';
import { useUnsignedStacksTransactionForFeeEstimation } from '@app/features/rpc-transaction-request/stacks/use-unsigned-transaction-for-fee-estimation';
import { useRpcTransactionRequest } from '@app/features/rpc-transaction-request/use-rpc-transaction-request';
import { useBreakOnNonCompliantEntity } from '@app/query/common/compliance-checker/compliance-checker.query';
import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';
import type { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';
import { useCurrentStacksNetworkState } from '@app/store/networks/networks.hooks';

import {
  getDecodedRpcStxTransferSip10FtRequest,
  getUnsignedStacksContractCallOptionsForFeeEstimation,
} from './rpc-stx-transfer-sip10-ft.utils';

interface RpcStxTransferSip10FtContainerProps {
  account: StacksAccount;
}
export function RpcStxTransferSip10FtContainer({ account }: RpcStxTransferSip10FtContainerProps) {
  const request = useRpcTransactionRequest();
  const network = useCurrentStacksNetworkState();
  const stxMarketData = useCryptoCurrencyMarketDataMeanAverage('STX');
  const { toggleSwitchAccount } = useSwitchAccountSheet();
  const navigate = useNavigate();

  const rpcRequest = useMemo(() => getDecodedRpcStxTransferSip10FtRequest(), []);
  const txOptionsForFeeEstimation = useMemo(
    () =>
      getUnsignedStacksContractCallOptionsForFeeEstimation({
        address: account.address,
        publicKey: account.stxPublicKey,
        network,
      }),
    [account.address, account.stxPublicKey, network]
  );

  const unsignedTxForFeeEstimation = useUnsignedStacksTransactionForFeeEstimation({
    method: stxTransferSip10Ft.method,
    request,
    txOptions: txOptionsForFeeEstimation,
  });

  const txSenderAddress = unsignedTxForFeeEstimation
    ? getTxSenderAddress(unsignedTxForFeeEstimation)
    : account.address;

  useBreakOnNonCompliantEntity([txSenderAddress, rpcRequest.params.recipient].filter(isDefined));

  if (!unsignedTxForFeeEstimation) return null;

  return (
    <StxBalanceLoader address={account.address}>
      {(balance, isLoadingAdditionalData) => (
        <StacksNonceLoader>
          {nonce => (
            <StacksFeeEditorProvider
              availableBalance={balance.availableBalance}
              marketData={stxMarketData}
              onGoBack={() => navigate(RouteUrls.RpcStxTransferSip10Ft)}
              unsignedTx={unsignedTxForFeeEstimation}
            >
              <NonceEditorProvider
                nonce={nonce}
                onGoBack={() => navigate(RouteUrls.RpcStxTransferSip10Ft)}
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
  );
}

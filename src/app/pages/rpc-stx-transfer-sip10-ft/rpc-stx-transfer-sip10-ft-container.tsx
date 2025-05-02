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

import { RpcStxTransferSip10FtProvider } from './rpc-stx-transfer-sip10-ft.context';
import {
  getDecodedRpcStxTransferSip10FtRequest,
  getStacksUnsignedContractCallOptionsForFeeEstimation,
} from './rpc-stx-transfer-sip10-ft.utils';

interface RpcStxTransferSip10FtContainerProps {
  account: StacksAccount;
}
export function RpcStxTransferSip10FtContainer({ account }: RpcStxTransferSip10FtContainerProps) {
  const request = useRpcTransactionRequest();
  const network = useCurrentStacksNetworkState();
  const stxMarketData = useCryptoCurrencyMarketDataMeanAverage('STX');
  const navigate = useNavigate();

  const rpcRequest = getDecodedRpcStxTransferSip10FtRequest();
  const txOptionsForFeeEstimation = getStacksUnsignedContractCallOptionsForFeeEstimation({
    address: account.address,
    publicKey: account.stxPublicKey,
    network,
  });

  useBreakOnNonCompliantEntity([account.address, rpcRequest.params.recipient].filter(isDefined));

  return (
    <StxBalanceLoader address={account.address}>
      {(balance, isLoadingAdditionalData) => (
        <StacksNonceLoader>
          {nonce => (
            <StacksFeeEditorProvider
              availableBalance={balance.availableBalance}
              marketData={stxMarketData}
              onGoBack={() => navigate(RouteUrls.RpcStxTransferSip10Ft)}
              txOptions={{ ...txOptionsForFeeEstimation, nonce }}
            >
              <NonceEditorProvider
                nonce={nonce}
                onGoBack={() => navigate(RouteUrls.RpcStxTransferSip10Ft)}
              >
                <RpcStxTransferSip10FtProvider
                  value={{
                    ...request,
                    isLoadingBalance: isLoadingAdditionalData,
                    address: account.address,
                    publicKey: account.stxPublicKey,
                    rpcRequest,
                    network,
                  }}
                >
                  <Outlet />
                </RpcStxTransferSip10FtProvider>
              </NonceEditorProvider>
            </StacksFeeEditorProvider>
          )}
        </StacksNonceLoader>
      )}
    </StxBalanceLoader>
  );
}

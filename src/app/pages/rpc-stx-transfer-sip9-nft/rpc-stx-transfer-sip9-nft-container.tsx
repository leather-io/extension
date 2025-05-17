import { useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { isDefined } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';

import { useSwitchAccountSheet } from '@app/common/switch-account/use-switch-account-sheet-context';
import { StacksNonceLoader } from '@app/components/loaders/stacks-nonce-loader';
import { StxBalanceLoader } from '@app/components/loaders/stx-balance-loader';
import { StacksFeeEditorProvider } from '@app/features/fee-editor/stacks/stacks-fee-editor.provider';
import { NonceEditorProvider } from '@app/features/nonce-editor/nonce-editor.provider';
import { StacksRpcTransactionRequestProvider } from '@app/features/rpc-transaction-request/stacks/stacks-rpc-transaction-request.context';
import { useRpcTransactionRequest } from '@app/features/rpc-transaction-request/use-rpc-transaction-request';
import { useBreakOnNonCompliantEntity } from '@app/query/common/compliance-checker/compliance-checker.query';
import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';
import type { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';
import { useCurrentStacksNetworkState } from '@app/store/networks/networks.hooks';

import {
  getDecodedRpcStxTransferSip9NftRequest,
  getUnsignedStacksContractCallOptionsForFeeEstimation,
} from './rpc-stx-transfer-sip9-nft.utils';

interface RpcStxTransferSip9NftContainerProps {
  account: StacksAccount;
}
export function RpcStxTransferSip9NftContainer({ account }: RpcStxTransferSip9NftContainerProps) {
  const request = useRpcTransactionRequest();
  const network = useCurrentStacksNetworkState();
  const stxMarketData = useCryptoCurrencyMarketDataMeanAverage('STX');
  const { toggleSwitchAccount } = useSwitchAccountSheet();
  const navigate = useNavigate();

  const rpcRequest = useMemo(() => getDecodedRpcStxTransferSip9NftRequest(), []);
  const txOptionsForFeeEstimation = useMemo(
    () =>
      getUnsignedStacksContractCallOptionsForFeeEstimation({
        address: account.address,
        publicKey: account.stxPublicKey,
        network,
      }),
    [account.address, account.stxPublicKey, network]
  );

  useBreakOnNonCompliantEntity([account.address, rpcRequest.params.recipient].filter(isDefined));

  return (
    <StxBalanceLoader address={account.address}>
      {(balance, isLoadingAdditionalData) => (
        <StacksNonceLoader>
          {nonce => (
            <StacksFeeEditorProvider
              availableBalance={balance.availableBalance}
              marketData={stxMarketData}
              onGoBack={() => navigate(RouteUrls.RpcStxTransferSip9Nft)}
              txOptions={{ ...txOptionsForFeeEstimation, nonce }}
            >
              <NonceEditorProvider
                nonce={nonce}
                onGoBack={() => navigate(RouteUrls.RpcStxTransferSip9Nft)}
              >
                <StacksRpcTransactionRequestProvider
                  value={{
                    ...request,
                    onUserActivatesSwitchAccount: toggleSwitchAccount,
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

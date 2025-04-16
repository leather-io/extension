import { Outlet, useNavigate } from 'react-router-dom';

import { isDefined, isString } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';

import { useSwitchAccountSheet } from '@app/common/switch-account/use-switch-account-sheet-context';
import { StacksNonceLoader } from '@app/components/loaders/stacks-nonce-loader';
import { StxBalanceLoader } from '@app/components/loaders/stx-balance-loader';
import { StacksFeeEditorProvider } from '@app/features/fee-editor/stacks/stacks-fee-editor.provider';
import { NonceEditorProvider } from '@app/features/nonce-editor/nonce-editor.provider';
import { useRpcTransactionRequest } from '@app/features/rpc-transaction-request/use-rpc-transaction-request';
import { useBreakOnNonCompliantEntity } from '@app/query/common/compliance-checker/compliance-checker.query';
import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useCurrentStacksNetworkState } from '@app/store/networks/networks.hooks';

import { RpcStxTransferStxProvider } from './rpc-stx-transfer-stx.context';
import { getStacksUnsignedTokenTransferOptionsFromRequest } from './rpc-stx-transfer-stx.utils';

export function RpcStxTransferStxContainer() {
  const request = useRpcTransactionRequest();
  const account = useCurrentStacksAccount();
  const network = useCurrentStacksNetworkState();
  const stxMarketData = useCryptoCurrencyMarketDataMeanAverage('STX');
  const { toggleSwitchAccount } = useSwitchAccountSheet();
  const navigate = useNavigate();

  const txOptions = getStacksUnsignedTokenTransferOptionsFromRequest({
    publicKey: account?.stxPublicKey ?? '',
    network,
  });
  const recipient = isString(txOptions.recipient) ? txOptions.recipient : txOptions.recipient.value;

  useBreakOnNonCompliantEntity([account?.address, recipient].filter(isDefined));

  return (
    <StxBalanceLoader address={account?.address ?? ''}>
      {(balance, isLoadingAdditionalData) => (
        <StacksNonceLoader>
          {nonce => (
            <StacksFeeEditorProvider
              availableBalance={balance.availableBalance}
              marketData={stxMarketData}
              onGoBack={() => navigate(RouteUrls.RpcStxTransferStx)}
              txOptions={{ ...txOptions, nonce }}
            >
              <NonceEditorProvider
                nonce={nonce}
                onGoBack={() => navigate(RouteUrls.RpcStxTransferStx)}
              >
                <RpcStxTransferStxProvider
                  value={{
                    ...request,
                    isLoading: isLoadingAdditionalData,
                    onUserActivatesSwitchAccount: toggleSwitchAccount,
                    txOptions,
                  }}
                >
                  <Outlet />
                </RpcStxTransferStxProvider>
              </NonceEditorProvider>
            </StacksFeeEditorProvider>
          )}
        </StacksNonceLoader>
      )}
    </StxBalanceLoader>
  );
}

import { Outlet, useNavigate } from 'react-router-dom';

import type { StacksTransactionWire } from '@stacks/transactions';

import {
  useCryptoCurrencyMarketDataMeanAverage,
  useStxCryptoAssetBalance,
} from '@leather.io/query';
import { stxCallContract } from '@leather.io/rpc';

import { RouteUrls } from '@shared/route-urls';

import { getTxSenderAddress } from '@app/common/transactions/stacks/transaction.utils';
import { StacksNonceLoader } from '@app/components/loaders/stacks-nonce-loader';
import { StacksFeeEditorProvider } from '@app/features/fee-editor/stacks/stacks-fee-editor.provider';
import { NonceEditorProvider } from '@app/features/nonce-editor/nonce-editor.provider';
import { RpcRequestProvider } from '@app/features/rpc-request/rpc-request-provider';
import { useBreakOnNonCompliantEntity } from '@app/query/common/compliance-checker/compliance-checker.query';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { useRpcStxCallContract } from './use-rpc-stx-call-contract';

export interface RpcCallContractRequest {
  unsignedTx: StacksTransactionWire;
}

export function RpcStxCallContractContainer() {
  const navigate = useNavigate();
  const stxMarketData = useCryptoCurrencyMarketDataMeanAverage('STX');
  const stxAddress = useCurrentStacksAccountAddress();
  const { isLoadingAdditionalData, filteredBalanceQuery } = useStxCryptoAssetBalance(stxAddress);
  const availableBalance = filteredBalanceQuery.data?.availableUnlockedBalance;
  const { unsignedTx } = useRpcStxCallContract();

  useBreakOnNonCompliantEntity(unsignedTx && getTxSenderAddress(unsignedTx));

  // Handle these better?
  if (!availableBalance || !unsignedTx) return null;

  return (
    <StacksNonceLoader>
      {nonce => (
        <StacksFeeEditorProvider
          availableBalance={availableBalance}
          marketData={stxMarketData}
          onGoBack={() => navigate(RouteUrls.RpcStxCallContract)}
          unsignedTx={unsignedTx}
        >
          <NonceEditorProvider
            nonce={nonce}
            onGoBack={() => navigate(RouteUrls.RpcStxCallContract)}
          >
            <RpcRequestProvider<RpcCallContractRequest>
              isLoading={isLoadingAdditionalData}
              method={stxCallContract.method}
              requestData={{ unsignedTx }}
            >
              <Outlet />
            </RpcRequestProvider>
          </NonceEditorProvider>
        </StacksFeeEditorProvider>
      )}
    </StacksNonceLoader>
  );
}

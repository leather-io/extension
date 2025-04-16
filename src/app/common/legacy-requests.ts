import { useMemo } from 'react';
import { useAsync } from 'react-async-hook';

import { type RpcMethodNames, createRpcSuccessResponse } from '@leather.io/rpc';
import { isUndefined } from '@leather.io/utils';

import { logger } from '@shared/logger';
import { RpcErrorMessage } from '@shared/rpc/methods/validation.utils';
import { closeWindow } from '@shared/utils';
import {
  type TransactionPayload,
  getLegacyTransactionPayloadFromToken,
} from '@shared/utils/legacy-requests';

import {
  type GenerateUnsignedTransactionOptions,
  generateUnsignedTransaction,
} from '@app/common/transactions/stacks/generate-unsigned-txs';
import {
  StacksTransactionActionType,
  getTxSenderAddress,
} from '@app/common/transactions/stacks/transaction.utils';
import { useStacksBroadcastTransaction } from '@app/features/stacks-transaction-request/hooks/use-legacy-stacks-broadcast-transaction';
import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useCurrentStacksNetworkState } from '@app/store/networks/networks.hooks';

import { useDefaultRequestParams } from './hooks/use-default-request-search-params';
import { initialSearchParams } from './initial-search-params';

// This file should be removed once no rpc requests are using the legacy request token

// Duplicate of `useTransactionRequestState`, remove with legacy requests
function useLegacyTxPayloadFromRpcRequest() {
  const request = initialSearchParams.get('request');
  if (!request) throw new Error(RpcErrorMessage.UndefinedParams);
  return useMemo(() => getLegacyTransactionPayloadFromToken(request), [request]);
}

function useUnsignedStacksTransaction(request: TransactionPayload) {
  const account = useCurrentStacksAccount();
  const { data: nextNonce } = useNextNonce(account?.address ?? '');
  const network = useCurrentStacksNetworkState();

  const tx = useAsync(async () => {
    if (isUndefined(account) || isUndefined(nextNonce)) return;

    const options: GenerateUnsignedTransactionOptions = {
      publicKey: account.stxPublicKey,
      txData: {
        ...request,
        network: request.network ?? network,
        sponsored: request.sponsored ?? false,
      },
      fee: request.fee ?? 0,
      nonce: request.nonce ?? nextNonce.nonce,
    };
    return generateUnsignedTransaction(options);
  }, [account, network, nextNonce, request]);

  return tx.result;
}

export function useLegacyRequestBroadcastTransaction(method: RpcMethodNames) {
  const { origin, tabId } = useDefaultRequestParams();
  const requestId = initialSearchParams.get('requestId') ?? '';
  const txPayload = useLegacyTxPayloadFromRpcRequest();
  const stacksTransaction = useUnsignedStacksTransaction(txPayload);
  const { stacksBroadcastTransaction } = useStacksBroadcastTransaction({
    actionType: StacksTransactionActionType.RpcRequest,
    token: '',
  });

  return useMemo(
    () => ({
      origin,
      txPayload,
      txSender: stacksTransaction ? getTxSenderAddress(stacksTransaction) : '',
      stacksTransaction,
      async onSignStacksTransaction(fee: number, nonce: number) {
        if (!stacksTransaction) {
          return logger.error('No stacks transaction to sign');
        }

        stacksTransaction.setFee(fee);
        stacksTransaction.setNonce(nonce);

        const result = await stacksBroadcastTransaction(stacksTransaction);
        if (!result) {
          throw new Error('Error broadcasting stacks transaction');
        }

        chrome.tabs.sendMessage(
          tabId,
          createRpcSuccessResponse(method, {
            id: requestId,
            result: {
              txid: result.txid,
              transaction: result.transaction.serialize(),
            },
          })
        );
        closeWindow();
      },
    }),
    [method, origin, requestId, stacksBroadcastTransaction, stacksTransaction, tabId, txPayload]
  );
}

import { useMemo } from 'react';
import { useAsync } from 'react-async-hook';

import { useNextNonce } from '@leather.io/query';
import { RpcErrorCode, createRpcErrorResponse, createRpcSuccessResponse } from '@leather.io/rpc';
import { isUndefined } from '@leather.io/utils';

import { logger } from '@shared/logger';
import { closeWindow } from '@shared/utils';
import {
  type TransactionPayload,
  getLegacyTransactionPayloadFromToken,
} from '@shared/utils/legacy-requests';

import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';
import { initialSearchParams } from '@app/common/initial-search-params';
import {
  type GenerateUnsignedTransactionOptions,
  generateUnsignedTransaction,
} from '@app/common/transactions/stacks/generate-unsigned-txs';
import { getTxSenderAddress } from '@app/common/transactions/stacks/transaction.utils';
import { useStacksBroadcastTransaction } from '@app/features/stacks-transaction-request/hooks/use-stacks-broadcast-transaction';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useCurrentStacksNetworkState } from '@app/store/networks/networks.hooks';

function useRpcStxCallContractParams() {
  const { origin, tabId } = useDefaultRequestParams();
  const requestId = initialSearchParams.get('requestId');
  const request = initialSearchParams.get('request');

  if (!origin || !request || !requestId) throw new Error('Invalid params');

  return useMemo(
    () => ({
      origin,
      tabId: tabId ?? 0,
      request: getLegacyTransactionPayloadFromToken(request),
      requestId,
    }),
    [origin, tabId, request, requestId]
  );
}

function useUnsignedStacksTransactionFromRequest(request: TransactionPayload) {
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

export function useRpcStxCallContract() {
  const { origin, request, requestId, tabId } = useRpcStxCallContractParams();
  const stacksTransaction = useUnsignedStacksTransactionFromRequest(request);
  const { stacksBroadcastTransaction } = useStacksBroadcastTransaction({ token: '' });

  return useMemo(
    () => ({
      origin,
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
          createRpcSuccessResponse('stx_callContract', {
            id: requestId,
            result: {
              txid: result.txid,
              transaction: result.transaction.serialize(),
            },
          })
        );
        closeWindow();
      },
      onCancel() {
        chrome.tabs.sendMessage(
          tabId,
          createRpcErrorResponse('stx_callContract', {
            id: requestId,
            error: {
              message: 'User denied signing stacks transaction',
              code: RpcErrorCode.USER_REJECTION,
            },
          })
        );
      },
    }),
    [origin, requestId, stacksBroadcastTransaction, stacksTransaction, tabId]
  );
}

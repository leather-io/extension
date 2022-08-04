import { useAtomCallback, useUpdateAtom, useAtomValue } from 'jotai/utils';
import {
  requestTokenPayloadState,
  transactionRequestValidationState,
} from '@app/store/transactions/requests';
import { requestTokenState } from '@app/store/transactions/requests';
import { transactionBroadcastErrorState } from '@app/store/transactions/transaction';
import { useCallback } from 'react';
import { finalizeTxSignature } from '@app/common/actions/finalize-tx-signature';
import { useAuthRequestParams } from '@app/common/hooks/auth/use-auth-request-params';

export function useTransactionRequestState() {
  return useAtomValue(requestTokenPayloadState);
}

export function useTransactionRequestValidation() {
  return useAtomValue(transactionRequestValidationState);
}

export function useTransactionBroadcastError() {
  return useAtomValue(transactionBroadcastErrorState);
}

export function useUpdateTransactionBroadcastError() {
  return useUpdateAtom(transactionBroadcastErrorState);
}

export function useOnCancelTransaction() {
  const { tabId } = useAuthRequestParams();
  return useAtomCallback(
    useCallback(
      async (get, set) => {
        const requestToken = get(requestTokenState);
        if (!requestToken) {
          set(transactionBroadcastErrorState, 'No pending transaction');
          return;
        }
        if (!tabId) throw new Error('Cannot cancel tx request with no tabId');
        try {
          finalizeTxSignature({ requestPayload: requestToken, data: 'cancel', tabId });
        } catch (error) {
          if (error instanceof Error) set(transactionBroadcastErrorState, error.message);
        }
      },
      [tabId]
    )
  );
}

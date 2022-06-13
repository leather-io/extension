import { useAtomCallback, useUpdateAtom, useAtomValue } from 'jotai/utils';
import {
  requestTokenPayloadState,
  requestTokenOriginState,
  transactionRequestValidationState,
} from '@app/store/transactions/requests';
import { requestTokenState } from '@app/store/transactions/requests';
import { transactionBroadcastErrorState } from '@app/store/transactions';
import { useCallback } from 'react';
import { finalizeTxSignature } from '@app/common/actions/finalize-tx-signature';

export function useOrigin() {
  return useAtomValue(requestTokenOriginState);
}

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
  return useAtomCallback(
    useCallback(async (get, set) => {
      const requestToken = get(requestTokenState);
      if (!requestToken) {
        set(transactionBroadcastErrorState, 'No pending transaction found.');
        return;
      }
      try {
        const result = 'cancel';
        finalizeTxSignature(requestToken, result);
      } catch (error) {
        if (error instanceof Error) set(transactionBroadcastErrorState, error.message);
      }
    }, [])
  );
}

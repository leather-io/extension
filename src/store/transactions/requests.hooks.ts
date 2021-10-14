import { useAtomCallback, useUpdateAtom, useAtomValue } from 'jotai/utils';
import {
  requestTokenPayloadState,
  requestTokenOriginState,
  transactionRequestValidationState,
  transactionRequestCustomFeeState,
  transactionRequestCustomFeeRateState,
} from '@store/transactions/requests';
import { requestTokenState } from '@store/transactions/requests';
import { transactionBroadcastErrorState } from '@store/transactions';
import { useCallback } from 'react';
import { finalizeTxSignature } from '@common/actions/finalize-tx-signature';

export function useOrigin() {
  return useAtomValue(requestTokenOriginState);
}

export function useTransactionRequestState() {
  return useAtomValue(requestTokenPayloadState);
}

export function useTransactionRequestCustomFee() {
  return useAtomValue(transactionRequestCustomFeeState);
}
export function useTransactionRequestCustomFeeRate() {
  return useAtomValue(transactionRequestCustomFeeRateState);
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

export function useOnCancel() {
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
        set(transactionBroadcastErrorState, error.message);
      }
    }, [])
  );
}

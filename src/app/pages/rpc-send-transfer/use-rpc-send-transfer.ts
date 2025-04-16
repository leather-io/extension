import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { createMoney, sumNumbers } from '@leather.io/utils';

import { RpcErrorMessage } from '@shared/rpc/methods/validation.utils';
import { closeWindow } from '@shared/utils';

import { useRpcRequestParams } from '@app/common/hooks/use-rpc-request-params';
import { initialSearchParams } from '@app/common/initial-search-params';

function useRpcSendTransferRequestParams() {
  const defaultParams = useRpcRequestParams();
  return useMemo(
    () => ({
      ...defaultParams,
      recipientAddresses: initialSearchParams.getAll('recipient') ?? [],
      amounts: initialSearchParams.getAll('amount') ?? [],
    }),
    [defaultParams]
  );
}

export function useRpcSendTransfer() {
  const { amounts, origin, recipientAddresses, requestId, tabId } =
    useRpcSendTransferRequestParams();

  if (origin === null) {
    closeWindow();
    throw new Error(RpcErrorMessage.NullOrigin);
  }

  const recipients = recipientAddresses.map((address, index) => ({
    address,
    amount: createMoney(Number(amounts[index]), 'BTC'),
  }));

  return {
    amount: createMoney(new BigNumber(sumNumbers(amounts.map(Number))), 'BTC'),
    origin,
    recipients,
    recipientAddresses,
    requestId,
    tabId,
  };
}

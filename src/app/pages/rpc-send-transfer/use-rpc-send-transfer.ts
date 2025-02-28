import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { createMoney, sumNumbers } from '@leather.io/utils';

import { RpcErrorMessage } from '@shared/rpc/methods/validation.utils';

import { useOnMount } from '@app/common/hooks/use-on-mount';
import { initialSearchParams } from '@app/common/initial-search-params';
import { useRpcRequestParams } from '@app/common/rpc/use-rpc-request';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';

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
  const { data: utxos = [], filteredUtxosQuery } = useCurrentNativeSegwitUtxos();
  const totalAmount = sumNumbers(amounts.map(Number));
  const amountAsMoney = createMoney(new BigNumber(totalAmount), 'BTC');

  // Forcing a refetch to ensure UTXOs are fresh
  useOnMount(() => filteredUtxosQuery.refetch());

  if (!origin) throw new Error(RpcErrorMessage.UndefinedParams);

  const recipients = recipientAddresses.map((address, index) => ({
    address,
    amount: createMoney(Number(amounts[index]), 'BTC'),
  }));

  return {
    amountAsMoney,
    origin,
    recipients,
    recipientAddresses,
    requestId,
    tabId,
    utxos,
  };
}

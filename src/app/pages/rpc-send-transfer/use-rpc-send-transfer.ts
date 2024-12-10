import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import BigNumber from 'bignumber.js';

import { createMoney, sumNumbers } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';

import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { initialSearchParams } from '@app/common/initial-search-params';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';

function useRpcSendTransferRequestParams() {
  const defaultParams = useDefaultRequestParams();
  return useMemo(
    () => ({
      ...defaultParams,
      requestId: initialSearchParams.get('requestId') ?? '',
      recipientsAddresses: initialSearchParams.getAll('recipient') ?? [],
      amounts: initialSearchParams.getAll('amount') ?? [],
    }),
    [defaultParams]
  );
}

export function useRpcSendTransfer() {
  const navigate = useNavigate();
  const { origin, recipientsAddresses, amounts, tabId, requestId } =
    useRpcSendTransferRequestParams();
  const { data: utxos = [], filteredUtxosQuery } = useCurrentNativeSegwitUtxos();
  const totalAmount = sumNumbers(amounts.map(Number));
  const amountAsMoney = createMoney(new BigNumber(totalAmount), 'BTC');

  // Forcing a refetch to ensure UTXOs are fresh
  useOnMount(() => filteredUtxosQuery.refetch());

  if (!origin) throw new Error('Invalid params');

  const recipients = recipientsAddresses.map((address, index) => ({
    address,
    amount: createMoney(Number(amounts[index]), 'BTC'),
  }));

  return {
    requestId,
    tabId,
    recipients,
    origin,
    utxos,
    totalAmount,
    amountAsMoney,
    recipientsAddresses,
    async onChooseTransferFee() {
      navigate(RouteUrls.RpcSendTransferChooseFee, {
        state: { recipients, utxos, amountAsMoney },
      });
    },
  };
}

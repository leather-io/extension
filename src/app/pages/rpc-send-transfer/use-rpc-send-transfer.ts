import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { initialSearchParams } from '@app/common/initial-search-params';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';

export function useRpcSendTransferRequestParams() {
  const defaultParams = useDefaultRequestParams();
  return useMemo(
    () => ({
      ...defaultParams,
      address: initialSearchParams.get('address') ?? '',
      amount: initialSearchParams.get('amount') ?? '',
      requestId: initialSearchParams.get('requestId') ?? '',
    }),
    [defaultParams]
  );
}

export function useRpcSendTransfer() {
  const navigate = useNavigate();
  const { address, amount, origin } = useRpcSendTransferRequestParams();
  const { data: utxos = [], refetch } = useCurrentNativeSegwitUtxos();

  // Forcing a refetch to ensure UTXOs are fresh
  useOnMount(() => refetch());

  if (!origin) throw new Error('Invalid params');

  return {
    address,
    amount,
    origin,
    utxos,
    async onChooseTransferFee() {
      navigate(RouteUrls.RpcSendTransferChooseFee, {
        state: { address, amount, utxos },
      });
    },
  };
}

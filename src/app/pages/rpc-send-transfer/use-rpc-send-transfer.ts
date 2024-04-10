import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { initialSearchParams } from '@app/common/initial-search-params';
import { sumNumbers } from '@app/common/math/helpers';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';

export function useRpcSendTransferRequestParams() {
  const defaultParams = useDefaultRequestParams();
  return useMemo(
    () => ({
      ...defaultParams,
      requestId: initialSearchParams.get('requestId') ?? '',
      recipients: initialSearchParams.getAll('recipient') ?? [],
      amounts: initialSearchParams.getAll('amount') ?? [],
    }),
    [defaultParams]
  );
}

export function useRpcSendTransfer() {
  const navigate = useNavigate();
  const { origin, recipients, amounts } = useRpcSendTransferRequestParams();
  const { data: utxos = [], refetch } = useCurrentNativeSegwitUtxos();

  // Forcing a refetch to ensure UTXOs are fresh
  useOnMount(() => refetch());

  if (!origin) throw new Error('Invalid params');

  return {
    recipients: recipients.map((address, index) => ({
      address,
      amount: amounts[index],
    })),
    origin,
    utxos,
    totalAmount: sumNumbers(amounts.map(Number)),
    recipientAddresses: recipients,
    async onChooseTransferFee() {
      navigate(RouteUrls.RpcSendTransferChooseFee, {
        state: { recipients, utxos },
      });
    },
  };
}

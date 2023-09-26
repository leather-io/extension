import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';
import { noop } from '@shared/utils';

import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { initialSearchParams } from '@app/common/initial-search-params';
import { useWalletType } from '@app/common/use-wallet-type';
import { useCurrentNativeSegwitAccountSpendableUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';

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
  const { whenWallet } = useWalletType();
  const { address, amount, origin } = useRpcSendTransferRequestParams();
  const { data: utxos = [], refetch } = useCurrentNativeSegwitAccountSpendableUtxos();

  // Forcing a refetch to ensure UTXOs are fresh
  useOnMount(() => refetch());

  if (!origin) throw new Error('Invalid params');

  return {
    address,
    amount,
    origin,
    utxos,
    async onChooseTransferFee() {
      whenWallet({
        software: () =>
          navigate(RouteUrls.RpcSendTransferChooseFee, {
            state: {
              address,
              amount,
              utxos,
            },
          }),
        ledger: noop,
      })();
    },
  };
}

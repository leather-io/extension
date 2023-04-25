import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';
import { noop } from '@shared/utils';

import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';
import { initialSearchParams } from '@app/common/initial-search-params';
import { useWalletType } from '@app/common/use-wallet-type';

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

  return {
    address,
    amount,
    origin,
    async onChooseTransferFee() {
      whenWallet({
        software: () =>
          navigate(RouteUrls.RpcSendTransferChooseFee, {
            state: {
              address,
              amount,
            },
          }),
        ledger: noop,
      })();
    },
  };
}

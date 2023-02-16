import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { bytesToHex } from '@stacks/common';
import { StacksTransaction } from '@stacks/transactions';

import { RouteUrls } from '@shared/route-urls';

interface ConfirmationRouteState {
  decimals?: number;
  token?: string;
  tx: string;
}

interface ConfirmationRouteStacksSip10Args {
  decimals?: number;
  name?: string;
  symbol: string;
  tx: StacksTransaction;
}

export function useSendFormNavigate() {
  const navigate = useNavigate();

  return useMemo(
    () => ({
      backToSendForm(state: any) {
        return navigate('../', { relative: 'path', replace: true, state });
      },
      toConfirmAndSignBtcTransaction(tx: string, recipient: string, fee: number) {
        return navigate(RouteUrls.SendBtcCryptoCurrencyConfirmation, {
          replace: true,
          state: {
            tx,
            recipient,
            fee,
          } as ConfirmationRouteState,
        });
      },
      toConfirmAndSignStxTransaction(tx: StacksTransaction) {
        return navigate(RouteUrls.SendStxCryptoCurrencyConfirmation, {
          replace: true,
          state: {
            tx: bytesToHex(tx.serialize()),
          } as ConfirmationRouteState,
        });
      },
      toConfirmAndSignStacksSip10Transaction({
        decimals,
        name,
        symbol,
        tx,
      }: ConfirmationRouteStacksSip10Args) {
        return navigate(RouteUrls.SendStacksSip10Confirmation.replace(':symbol', symbol), {
          replace: true,
          state: {
            decimals,
            token: name,
            tx: bytesToHex(tx.serialize()),
          } as ConfirmationRouteState,
        });
      },
    }),
    [navigate]
  );
}

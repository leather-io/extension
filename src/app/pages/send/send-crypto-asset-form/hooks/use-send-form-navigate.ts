import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { bytesToHex } from '@stacks/common';
import { StacksTransaction } from '@stacks/transactions';

interface ConfirmationRouteState {
  decimals?: number;
  token?: string;
  tx: string;
}

interface ConfirmationRouteStacksSip10Args {
  decimals?: number;
  name?: string;
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
        return navigate('confirm', {
          replace: true,
          state: {
            tx,
            recipient,
            fee,
          } as ConfirmationRouteState,
        });
      },
      toConfirmAndSignStxTransaction(tx: StacksTransaction) {
        return navigate('confirm', {
          replace: true,
          state: {
            tx: bytesToHex(tx.serialize()),
          } as ConfirmationRouteState,
        });
      },
      toConfirmAndSignStacksSip10Transaction({
        decimals,
        name,
        tx,
      }: ConfirmationRouteStacksSip10Args) {
        return navigate('confirm', {
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

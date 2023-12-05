import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { bytesToHex } from '@stacks/common';
import { StacksTransaction } from '@stacks/transactions';
import { AxiosError } from 'axios';

import { BitcoinSendFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';

import { UtxoResponseItem } from '@app/query/bitcoin/bitcoin-client';

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

interface ConfirmationRouteBtcArgs {
  tx: string;
  recipient: string;
  fee: number;
  feeRowValue: string;
  time: string;
}

export function useSendFormNavigate() {
  const navigate = useNavigate();

  return useMemo(
    () => ({
      backToSendForm(state: any) {
        return navigate('../', { relative: 'path', replace: true, state });
      },
      toChooseTransactionFee(
        isSendingMax: boolean,
        utxos: UtxoResponseItem[],
        values: BitcoinSendFormValues
      ) {
        return navigate('choose-fee', {
          state: {
            isSendingMax,
            utxos,
            values,
          },
        });
      },
      toConfirmAndSignBtcTransaction({
        tx,
        recipient,
        fee,
        feeRowValue,
        time,
      }: ConfirmationRouteBtcArgs) {
        return navigate(RouteUrls.SendBtcConfirmation, {
          state: {
            tx,
            recipient,
            fee,
            feeRowValue,
            time,
          } as ConfirmationRouteState,
        });
      },
      toConfirmAndSignStxTransaction(tx: StacksTransaction, showFeeChangeWarning: boolean) {
        return navigate('confirm', {
          replace: true,
          state: {
            tx: bytesToHex(tx.serialize()),
            showFeeChangeWarning,
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
      toErrorPage(error: unknown) {
        // without this processing, navigate does not work
        const processedError = error instanceof AxiosError ? new Error(error.message) : error;

        return navigate('../error', {
          relative: 'path',
          replace: true,
          state: { error: processedError },
        });
      },
    }),
    [navigate]
  );
}

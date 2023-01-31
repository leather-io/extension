import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { bytesToHex } from '@stacks/common';
import { StacksTransaction } from '@stacks/transactions';

import { BitcoinTransaction } from '@shared/models/transactions/bitcoin-transaction.model';
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
      toConfirmAndSignBtcTransaction(tx: BitcoinTransaction) {
        return navigate(`${RouteUrls.SendCryptoAsset}/btc/confirmation`, {
          state: {
            tx: `${tx}`, // TODO: Serialize bitcoin tx
          } as ConfirmationRouteState,
        });
      },
      toConfirmAndSignStxTransaction(tx: StacksTransaction) {
        return navigate(`${RouteUrls.SendCryptoAsset}/stx/confirmation`, {
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
        return navigate(`${RouteUrls.SendCryptoAsset}/${symbol}/confirmation`, {
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

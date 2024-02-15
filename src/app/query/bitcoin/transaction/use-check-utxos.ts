import { useCallback, useState } from 'react';

import * as btc from '@scure/btc-signer';
import { bytesToHex } from '@stacks/common';

import type { SupportedInscription } from '@shared/models/inscription.model';
import { isUndefined } from '@shared/utils';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { getNumberOfInscriptionOnUtxoUsingOrdinalsCom } from '../ordinals/inscriptions.query';

class PreventTransactionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreventTransactionError';
  }
}

interface UseCheckInscribedUtxosArgs {
  inputs: btc.TransactionInput[];
  blockTxAction?(): void;
}

interface FilterOutIntentionalInscriptionsSpendArgs {
  inputs: btc.TransactionInput[];
  inscriptions: SupportedInscription[];
}
export function filterOutIntentionalInscriptionsSpend({
  inputs,
  inscriptions,
}: FilterOutIntentionalInscriptionsSpendArgs) {
  return inputs.filter(input => {
    if (!input.txid) throw new Error('Transaction ID is missing in the input');
    const inputTxid = bytesToHex(input.txid);

    return inscriptions.every(inscription => {
      return inscription.tx_id !== inputTxid;
    });
  });
}

export function useCheckInscribedUtxos({ inputs, blockTxAction }: UseCheckInscribedUtxosArgs) {
  const client = useBitcoinClient();
  const analytics = useAnalytics();
  const [isLoading, setIsLoading] = useState(false);
  const { isTestnet } = useCurrentNetworkState();

  const preventTransaction = useCallback(() => {
    if (blockTxAction) return blockTxAction();
    throw new PreventTransactionError(
      'Transaction is prevented due to inscribed utxos in the transaction. Please contact support for more information.'
    );
  }, [blockTxAction]);

  const checkIfUtxosListIncludesInscribed = useCallback(async () => {
    setIsLoading(true);
    const txids = inputs.map(input => {
      if (!input.txid) throw new Error('Transaction ID is missing in the input');
      return bytesToHex(input.txid);
    });

    try {
      // no need to check for inscriptions on testnet
      if (isTestnet) {
        return false;
      }

      if (txids.length === 0) {
        throw new Error('Utxos list cannot be empty');
      }

      const responses = await Promise.all(
        txids.map(id => client.bestinslotInscriptionsApi.getInscriptionsByTransactionId(id))
      );

      const hasInscribedUtxo = responses.some(resp => {
        return resp.data.length > 0;
      });

      if (hasInscribedUtxo) {
        void analytics.track('utxos_includes_inscribed_one', {
          txids,
        });
        preventTransaction();
        return true;
      }

      return false;
    } catch (e) {
      if (e instanceof PreventTransactionError) {
        throw e;
      }

      void analytics.track('error_checking_utxos_from_bestinslot', {
        txids,
      });

      const ordinalsComResponses = await Promise.all(
        txids.map(async (id, index) => {
          const inscriptionIndex = inputs[index].index;
          if (isUndefined(inscriptionIndex)) {
            throw new Error('Inscription index is missing in the input');
          }
          const num = await getNumberOfInscriptionOnUtxoUsingOrdinalsCom(id, inscriptionIndex);
          return num > 0;
        })
      );

      const hasInscribedUtxo = ordinalsComResponses.some(resp => resp);

      // if there are inscribed utxos in the transaction, and no error => prevent the transaction
      if (hasInscribedUtxo) {
        preventTransaction();
        return true;
      }

      return true;
    } finally {
      setIsLoading(false);
    }
  }, [client.bestinslotInscriptionsApi, inputs, preventTransaction, isTestnet, analytics]);

  return {
    checkIfUtxosListIncludesInscribed,
    isLoading,
  };
}

import { useCallback, useState } from 'react';

import * as btc from '@scure/btc-signer';
import { bytesToHex } from '@stacks/common';

import { IS_TEST_ENV } from '@shared/environment';
import { isUndefined } from '@shared/utils';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import type {
  BestinslotInscriptionByIdResponse,
  BestinslotInscriptionsByTxIdResponse,
} from '../bitcoin-client';
import { getNumberOfInscriptionOnUtxoUsingOrdinalsCom } from '../ordinals/inscriptions.query';

class PreventTransactionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreventTransactionError';
  }
}

interface FilterOutIntentionalInscriptionsSpendArgs {
  inputs: btc.TransactionInput[];
  intentionalSpendUtxoIds: string[];
}

export function filterOutIntentionalUtxoSpend({
  inputs,
  intentionalSpendUtxoIds,
}: FilterOutIntentionalInscriptionsSpendArgs): btc.TransactionInput[] {
  return inputs.filter(input => {
    if (!input.txid) throw new Error('Transaction ID is missing in the input');
    const inputTxid = bytesToHex(input.txid);

    return intentionalSpendUtxoIds.every(id => {
      return id !== inputTxid;
    });
  });
}

interface CheckInscribedUtxosByBestinslotArgs {
  inputs: btc.TransactionInput[];
  txids: string[];
  getInscriptionsByTransactionId(id: string): Promise<BestinslotInscriptionsByTxIdResponse>;
  getInscriptionById(id: string): Promise<BestinslotInscriptionByIdResponse>;
}

async function checkInscribedUtxosByBestinslot({
  inputs,
  txids,
  getInscriptionsByTransactionId,
  getInscriptionById,
}: CheckInscribedUtxosByBestinslotArgs): Promise<boolean> {
  /**
   * @description Get the list of inscriptions moving on a transaction
   * @see https://docs.bestinslot.xyz/reference/api-reference/ordinals-and-brc-20-and-bitmap-v3-api-mainnet+testnet/inscriptions
   */
  const inscriptionIdsList = await Promise.all(txids.map(id => getInscriptionsByTransactionId(id)));

  const inscriptionIds = inscriptionIdsList.flatMap(inscription =>
    inscription.data.map(data => data.inscription_id)
  );

  const inscriptionsList = await Promise.all(inscriptionIds.map(id => getInscriptionById(id)));

  const hasInscribedUtxos = inscriptionsList.some(resp => {
    return inputs.some(input => {
      if (!input.txid) throw new Error('Transaction ID is missing in the input');
      const idWithIndex = `${bytesToHex(input.txid)}:${input.index}`;
      return resp.data.satpoint.includes(idWithIndex);
    });
  });

  return hasInscribedUtxos;
}

export function useCheckUnspendableUtxos(blockTxAction?: () => void) {
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

  const checkIfUtxosListIncludesInscribed = useCallback(
    async (inputs: btc.TransactionInput[]) => {
      setIsLoading(true);
      const txids = inputs.map(input => {
        if (!input.txid) throw new Error('Transaction ID is missing in the input');
        return bytesToHex(input.txid);
      });

      try {
        // no need to check for inscriptions on testnet
        if (isTestnet && !IS_TEST_ENV) {
          return false;
        }

        if (txids.length === 0) {
          throw new Error('Utxos list cannot be empty');
        }

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
          void analytics.track('utxos_includes_inscribed_one', {
            txids,
            inputs,
          });
          preventTransaction();
          return true;
        }

        // if there are no inscribed utxos in the transaction => allow the transaction
        return false;
      } catch (e) {
        if (e instanceof PreventTransactionError) {
          throw e;
        }

        void analytics.track('error_checking_utxos_from_ordinalscom', {
          txids,
          inputs,
        });

        const hasInscribedUtxo = await checkInscribedUtxosByBestinslot({
          inputs,
          txids,
          getInscriptionsByTransactionId: client.BestinslotApi.getInscriptionsByTransactionId,
          getInscriptionById: client.BestinslotApi.getInscriptionById,
        });

        if (hasInscribedUtxo) {
          void analytics.track('utxos_includes_inscribed_one', {
            txids,
            inputs,
          });
          preventTransaction();
          return true;
        }

        // if there are no inscribed utxos in the transaction => allow the transaction
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [analytics, client, isTestnet, preventTransaction]
  );

  const checkIfUtxosListIncludesRunes = useCallback(async (inputs: btc.TransactionInput[]) => {
    return false;
  }, []);

  return {
    checkIfUtxosListIncludesInscribed,
    checkIfUtxosListIncludesRunes,
    isLoading,
  };
}

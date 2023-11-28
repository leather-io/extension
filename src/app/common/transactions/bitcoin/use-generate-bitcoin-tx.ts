import { useCallback } from 'react';

import * as btc from '@scure/btc-signer';

import { logger } from '@shared/logger';
import { Money } from '@shared/models/money.model';

import {
  determineUtxosForSpend,
  determineUtxosForSpendAll,
} from '@app/common/transactions/bitcoin/coinselect/local-coin-selection';
import { UtxoResponseItem } from '@app/query/bitcoin/bitcoin-client';
import { useBitcoinScureLibNetworkConfig } from '@app/store/accounts/blockchain/bitcoin/bitcoin-keychain';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

interface GenerateNativeSegwitSingleRecipientTxValues {
  amount: Money;
  recipient: string;
}
export function useGenerateUnsignedNativeSegwitSingleRecipientTx() {
  const signer = useCurrentAccountNativeSegwitIndexZeroSigner();

  const networkMode = useBitcoinScureLibNetworkConfig();

  return useCallback(
    async (
      values: GenerateNativeSegwitSingleRecipientTxValues,
      feeRate: number,
      utxos: UtxoResponseItem[],
      isSendingMax?: boolean
    ) => {
      if (!utxos.length) return;
      if (!feeRate) return;

      try {
        const tx = new btc.Transaction();

        const amountAsNumber = values.amount.amount.toNumber();

        const determineUtxosArgs = {
          amount: amountAsNumber,
          feeRate,
          recipient: values.recipient,
          utxos,
        };

        const { inputs, outputs, fee } = isSendingMax
          ? determineUtxosForSpendAll(determineUtxosArgs)
          : determineUtxosForSpend(determineUtxosArgs);

        logger.info('Coin selection', { inputs, outputs, fee });

        if (!inputs.length) throw new Error('No inputs to sign');
        if (!outputs.length) throw new Error('No outputs to sign');

        if (outputs.length > 2)
          throw new Error('Address reuse mode: wallet should have max 2 outputs');

        const p2wpkh = btc.p2wpkh(signer.publicKey, networkMode);

        for (const input of inputs) {
          tx.addInput({
            txid: input.txid,
            index: input.vout,
            sequence: 0,
            witnessUtxo: {
              // script = 0014 + pubKeyHash
              script: p2wpkh.script,
              amount: BigInt(input.value),
            },
          });
        }

        outputs.forEach(output => {
          // When coin selection returns output with no address we assume it is
          // a change output
          if (!output.address) {
            tx.addOutputAddress(signer.address, BigInt(output.value), networkMode);
            return;
          }
          tx.addOutputAddress(values.recipient, BigInt(output.value), networkMode);
        });

        return { hex: tx.hex, fee, psbt: tx.toPSBT(), inputs };
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('Error signing bitcoin transaction', e);
        return null;
      }
    },
    [networkMode, signer.address, signer.publicKey]
  );
}

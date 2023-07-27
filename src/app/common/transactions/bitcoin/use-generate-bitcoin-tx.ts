import { useMemo } from 'react';

import * as btc from '@scure/btc-signer';

import { logger } from '@shared/logger';
import { Money } from '@shared/models/money.model';

import {
  determineUtxosForSpend,
  determineUtxosForSpendAll,
} from '@app/common/transactions/bitcoin/coinselect/local-coin-selection';
import { useWalletType } from '@app/common/use-wallet-type';
import { UtxoResponseItem } from '@app/query/bitcoin/bitcoin-client';
import { useBitcoinScureLibNetworkConfig } from '@app/store/accounts/blockchain/bitcoin/bitcoin-keychain';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

interface GenerateNativeSegwitTxValues {
  amount: Money;
  recipient: string;
}
export function useGenerateUnsignedNativeSegwitTx() {
  const signer = useCurrentAccountNativeSegwitIndexZeroSigner();
  const networkMode = useBitcoinScureLibNetworkConfig();

  const { whenWallet } = useWalletType();

  return useMemo(
    () => ({
      sign(tx: btc.Transaction) {
        whenWallet({
          ledger() {
            logger.info('Signing tx with ledger', tx);
          },
          software() {
            signer.sign(tx);
            tx.finalize();
            return tx;
          },
        })();
      },
      generateTx: (
        values: GenerateNativeSegwitTxValues,
        feeRate: number,
        utxos: UtxoResponseItem[],
        isSendingMax?: boolean
      ) => {
        if (!utxos.length) return;
        if (!feeRate) return;

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

        inputs.forEach(input => {
          const p2wpkh = btc.p2wpkh(signer.publicKey, networkMode);
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
        });
        outputs.forEach(output => {
          // When coin selection returns output with no address we assume it is
          // a change output
          if (!output.address) {
            tx.addOutputAddress(signer.address, BigInt(output.value), networkMode);
            return;
          }
          tx.addOutputAddress(values.recipient, BigInt(output.value), networkMode);
        });

        return { tx, fee };
      },
    }),
    [signer, networkMode, whenWallet]
  );
}

import { useCallback, useMemo } from 'react';

import * as btc from '@scure/btc-signer';

import { Money, createMoney } from '@shared/models/money.model';

import { BtcSizeFeeEstimator } from '@app/common/transactions/bitcoin/fees/btc-size-fee-estimator';
import { sumNumbers } from '@app/common/utils';
import { useCurrentTaprootAccountUninscribedUtxos } from '@app/query/bitcoin/balance/bitcoin-balances.query';
import { useBitcoinFeeRate } from '@app/query/bitcoin/fees/fee-estimates.hooks';
import { getNumberOfInscriptionOnUtxo } from '@app/query/bitcoin/ordinals/use-ordinals-aware-utxo.query';
import { useBitcoinLibNetworkConfig } from '@app/store/accounts/blockchain/bitcoin/bitcoin-keychain';
import { useCurrentAccountTaprootSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

export function useGenerateRetrieveTaprootFundsTx() {
  const networkMode = useBitcoinLibNetworkConfig();
  const uninscribedUtxos = useCurrentTaprootAccountUninscribedUtxos();
  const createSigner = useCurrentAccountTaprootSigner();
  const { data: feeRate } = useBitcoinFeeRate();

  const fee = useMemo(() => {
    if (!feeRate) return createMoney(0, 'BTC');
    const txSizer = new BtcSizeFeeEstimator();
    const { txVBytes } = txSizer.calcTxSize({
      input_count: uninscribedUtxos.length,
      p2wpkh_output_count: 1,
    });
    return createMoney(Math.ceil(txVBytes * feeRate.hourFee), 'BTC');
  }, [feeRate, uninscribedUtxos.length]);

  const generateRetrieveTaprootFundsTx = useCallback(
    async ({ recipient, fee }: { recipient: string; fee: Money }) => {
      const tx = new btc.Transaction();
      const totalAmount = sumNumbers(uninscribedUtxos.map(utxo => utxo.value));

      uninscribedUtxos.forEach(utxo => {
        const signer = createSigner?.(utxo.addressIndex);
        if (!signer) return;

        tx.addInput({
          txid: utxo.txid,
          index: utxo.vout,
          tapInternalKey: signer.payment.tapInternalKey,
          witnessUtxo: {
            script: signer.payment.script,
            amount: BigInt(utxo.value),
          },
        });
      });

      const zeroInscriptionCheckResults = await Promise.all(
        uninscribedUtxos.map(utxo => getNumberOfInscriptionOnUtxo(utxo.txid, utxo.vout))
      );

      if (!zeroInscriptionCheckResults.every(inscriptionCount => inscriptionCount === 0)) {
        throw new Error('Inscription found in utxos');
      }

      const paymentAmount = BigInt(totalAmount.minus(fee.amount.toString()).toString());

      tx.addOutputAddress(recipient, paymentAmount, networkMode);

      uninscribedUtxos.forEach(utxo => createSigner?.(utxo.addressIndex).sign(tx));

      tx.finalize();
      return tx.hex;
    },
    [createSigner, networkMode, uninscribedUtxos]
  );

  return { generateRetrieveTaprootFundsTx, fee };
}

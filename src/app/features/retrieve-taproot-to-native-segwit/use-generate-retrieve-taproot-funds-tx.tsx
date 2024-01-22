import { useCallback, useMemo } from 'react';

import * as btc from '@scure/btc-signer';

import { extractAddressIndexFromPath } from '@shared/crypto/bitcoin/bitcoin.utils';
import { Money, createMoney } from '@shared/models/money.model';

import { sumNumbers } from '@app/common/math/helpers';
import { BtcSizeFeeEstimator } from '@app/common/transactions/bitcoin/fees/btc-size-fee-estimator';
import { useCurrentTaprootAccountUninscribedUtxos } from '@app/query/bitcoin/balance/btc-taproot-balance.hooks';
import { useAverageBitcoinFeeRates } from '@app/query/bitcoin/fees/fee-estimates.hooks';
import { useNumberOfInscriptionsOnUtxo } from '@app/query/bitcoin/ordinals/inscriptions.hooks';
import { useBitcoinScureLibNetworkConfig } from '@app/store/accounts/blockchain/bitcoin/bitcoin-keychain';
import { useCurrentAccountTaprootSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

export function useGenerateRetrieveTaprootFundsTx() {
  const networkMode = useBitcoinScureLibNetworkConfig();
  const uninscribedUtxos = useCurrentTaprootAccountUninscribedUtxos();
  const createSigner = useCurrentAccountTaprootSigner();
  const { data: feeRates } = useAverageBitcoinFeeRates();
  const getNumberOfInscriptionOnUtxo = useNumberOfInscriptionsOnUtxo();

  const fee = useMemo(() => {
    if (!feeRates) return createMoney(0, 'BTC');
    const txSizer = new BtcSizeFeeEstimator();
    const { txVBytes } = txSizer.calcTxSize({
      input_count: uninscribedUtxos.length,
      p2wpkh_output_count: 1,
    });
    return createMoney(Math.ceil(txVBytes * feeRates.hourFee.toNumber()), 'BTC');
  }, [feeRates, uninscribedUtxos.length]);

  const generateRetrieveTaprootFundsTx = useCallback(
    async ({ recipient, fee }: { recipient: string; fee: Money }) => {
      const tx = new btc.Transaction();
      const totalAmount = sumNumbers(uninscribedUtxos.map(utxo => utxo.value));

      uninscribedUtxos.forEach(utxo => {
        const addressIndex = extractAddressIndexFromPath(utxo.derivationPath);
        const signer = createSigner?.(addressIndex);
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

      uninscribedUtxos.forEach(utxo => {
        const addressIndex = extractAddressIndexFromPath(utxo.derivationPath);
        return createSigner?.(addressIndex).sign(tx);
      });

      tx.finalize();
      return tx.hex;
    },
    [createSigner, getNumberOfInscriptionOnUtxo, networkMode, uninscribedUtxos]
  );

  return { generateRetrieveTaprootFundsTx, fee };
}

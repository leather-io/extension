import { useCallback } from 'react';

import BigNumber from 'bignumber.js';
import * as btc from 'micro-btc-signer';

import { getBtcSignerLibNetworkByMode } from '@shared/crypto/bitcoin/bitcoin.network';
import { OrdinalSendFormValues } from '@shared/models/form.model';

import { useBitcoinFeeRate } from '@app/query/bitcoin/fees/fee-estimates.hooks';
import { TaprootUtxo } from '@app/query/bitcoin/ordinals/use-taproot-address-utxos.query';
import { useCurrentAccountTaprootSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { BtcSizeFeeEstimator } from '../send-crypto-asset-form/family/bitcoin/fees/btc-size-fee-estimator';
import { Inscription } from './use-send-ordinal-inscription-route-state';

// Ord sends restricted to 1 input and 1 output
const btcTxSizer = new BtcSizeFeeEstimator();
const assumedTxSize = btcTxSizer.calcTxSize({ input_count: 1, p2tr_output_count: 1 });
function calculateInscriptionSendTxFee(feeRate: number) {
  return new BigNumber(feeRate).multipliedBy(assumedTxSize.txVBytes);
}

const arbitrarySmallMarginNumber = 10;

function throwIfUtxoCannotCoverFee(fee: BigNumber, utxoValue: number) {
  const remainder = new BigNumber(utxoValue).minus(fee);
  // eslint-disable-next-line no-console
  console.log('remainder', { remainder: remainder.toString(), fee: fee.toString(), utxoValue });
  return remainder.isLessThan(arbitrarySmallMarginNumber);
}

export function useGenerateSignedOrdinalTx(inscription: Inscription, utxo: TaprootUtxo) {
  const signer = useCurrentAccountTaprootSigner(utxo?.addressIndex ?? 0);
  const network = useCurrentNetwork();
  const { data: feeRate } = useBitcoinFeeRate();

  return useCallback(
    (values: OrdinalSendFormValues) => {
      if (!feeRate) return;
      const fee = calculateInscriptionSendTxFee(feeRate.fastestFee);
      const showCannotCoverFeeError = throwIfUtxoCannotCoverFee(
        fee,
        Number(inscription['output value'])
      );

      const networkMode = getBtcSignerLibNetworkByMode(network.chain.bitcoin.network);

      try {
        const tx = new btc.Transaction();
        tx.addInput({
          txid: utxo.txid,
          index: utxo.vout,
          tapInternalKey: signer.payment.tapInternalKey,
          witnessUtxo: {
            script: signer.payment.script,
            amount: BigInt(utxo.value),
          },
        });
        tx.addOutputAddress(
          values.recipient,
          BigInt(Math.ceil(new BigNumber(utxo.value).minus(fee).toNumber())),
          networkMode
        );
        signer.sign(tx);
        tx.finalize();
        return { hex: tx.hex, fee, showCannotCoverFeeError };
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('Error signing ordinal transaction', e);
        return null;
      }
    },
    [feeRate, inscription, network.chain.bitcoin.network, signer, utxo]
  );
}

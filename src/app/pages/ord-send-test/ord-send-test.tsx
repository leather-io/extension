import { useLocation } from 'react-router-dom';

import { Text } from '@stacks/ui';
import BigNumber from 'bignumber.js';
import get from 'lodash.get';
import * as btc from 'micro-btc-signer';

import { getBtcSignerLibNetworkByMode } from '@shared/crypto/bitcoin/bitcoin.network';

import { FeeEstimateMempoolSpaceApi } from '@app/query/bitcoin/bitcoin-client';
import { useBitcoinFeeRate } from '@app/query/bitcoin/fees/fee-estimates.hooks';
import { TaprootUtxo } from '@app/query/bitcoin/ordinals/use-taproot-address-utxos.query';
import { useCurrentAccountTaprootSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { Inscription } from '../send/ordinal-inscription/use-send-ordinal-inscription-route-state';
import { BtcSizeFeeEstimator } from '../send/send-crypto-asset-form/family/bitcoin/fees/btc-size-fee-estimator';

//
// Description of mess: From homepage we're navigating with route state the info
// needed to construct the tx.

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
  if (remainder.isLessThan(arbitrarySmallMarginNumber))
    throw new Error('Insufficient value to cover fee');
}

function OrdSendTestContainer(props: OrdSendTestContainerProps) {
  const { inscription, utxo, fees } = props;

  const network = useCurrentNetwork();
  const signer = useCurrentAccountTaprootSigner(utxo?.addressIndex ?? 0);

  // console.log('signer', signer);
  const txFee = calculateInscriptionSendTxFee(fees.fastestFee);

  throwIfUtxoCannotCoverFee(txFee, Number(inscription['output value']));

  function sign() {
    // console.log('executing sign', signer.payment);
    const networkMode = getBtcSignerLibNetworkByMode(network.chain.bitcoin.network);

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
      'bc1p7wfj2uwlqvh3dzl3ek8vv973a8hul7u85s68yl5nu50tuv80evqs2pu9kp',
      BigInt(Math.ceil(new BigNumber(utxo.value).minus(txFee).toNumber())),
      networkMode
    );
    signer.sign(tx);
    tx.finalize();
    console.log('tx', tx.hex);
  }

  return (
    <Text textStyle="body.small" fontSize="12px">
      <pre>{JSON.stringify(inscription, null, 2)}</pre>
      <pre>{JSON.stringify({ utxo }, null, 2)}</pre>
      <button onClick={sign}>sign</button>
    </Text>
  );
}

import { BTC_P2WPKH_DUST_AMOUNT } from '@leather.io/constants';
import type { UtxoResponseItem, UtxoWithDerivationPath } from '@leather.io/query';
import { createCounter, isDefined, sumNumbers } from '@leather.io/utils';

import { BtcSizeFeeEstimator } from '@app/common/transactions/bitcoin/fees/btc-size-fee-estimator';

interface SelectInscriptionCoinSuccess {
  success: true;
  inputs: UtxoResponseItem[];
  outputs: { value: bigint; address: string }[];
  txFee: number;
}

interface SelectInscriptionCoinFailure {
  success: false;
}

type SelectInscriptionCoinResult = SelectInscriptionCoinSuccess | SelectInscriptionCoinFailure;

interface SelectInscriptionTransferCoinsArgs {
  inscriptionInput: UtxoWithDerivationPath;
  nativeSegwitUtxos: UtxoResponseItem[];
  feeRate: number;
  recipient: string;
  changeAddress: string;
}

export function selectTaprootInscriptionTransferCoins(
  args: SelectInscriptionTransferCoinsArgs
): SelectInscriptionCoinResult {
  const { inscriptionInput, recipient, changeAddress, nativeSegwitUtxos, feeRate } = args;

  if (nativeSegwitUtxos.length === 0) return { success: false };

  const txSizer = new BtcSizeFeeEstimator();

  const initialTxSize = txSizer.calcTxSize({
    input_script: 'p2wpkh',
    input_count: 1,
    // From the address of the recipient, we infer the output type
    p2tr_output_count: 1,
    p2wpkh_output_count: 1,
  });

  const neededInputs: UtxoResponseItem[] = [];

  let txFee = Math.ceil(initialTxSize.txVBytes * feeRate);

  const indexCounter = createCounter();

  function shouldContinueTryingWithMoreInputs() {
    const neededSumOfInputs = sumNumbers(neededInputs.map(utxo => utxo.value));
    if (indexCounter.getValue() > nativeSegwitUtxos.length) return false;
    return txFee >= neededSumOfInputs.toNumber();
  }

  let utxos = nativeSegwitUtxos
    .filter(utxo => utxo.value >= BTC_P2WPKH_DUST_AMOUNT)
    .sort((a, b) => b.value - a.value);
  let txSize = null;

  while (shouldContinueTryingWithMoreInputs()) {
    const [nextUtxo, ...remainingUtxos] = utxos;
    if (nextUtxo) neededInputs.push(nextUtxo);
    utxos = remainingUtxos;
    txSize = txSizer.calcTxSize({
      input_script: 'p2wpkh',
      input_count: neededInputs.length + 1,
      p2tr_output_count: 1,
      p2wpkh_output_count: 1,
    });
    indexCounter.increment();
  }

  if (!txSize) throw new Error('Transaction size must be defined');

  txFee = Math.ceil(txSize.txVBytes * feeRate);

  const inputs = [...neededInputs];

  const changeAmount = sumNumbers(neededInputs.map(utxo => utxo.value)).minus(txFee);

  if (changeAmount.isLessThan(0)) return { success: false };

  const outputs = [
    // outputs[0] = inscription going to recipient
    { value: BigInt(inscriptionInput.value), address: recipient },
    changeAmount.isGreaterThan(0)
      ? { value: BigInt(changeAmount.toNumber()), address: changeAddress }
      : undefined,
  ].filter(isDefined);

  return { success: true, inputs, outputs, txFee };
}

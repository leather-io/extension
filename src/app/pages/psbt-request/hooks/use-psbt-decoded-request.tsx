import { useCallback, useMemo, useState } from 'react';

import * as btc from '@scure/btc-signer';

import { BitcoinNetworkModes } from '@shared/constants';
import { getAddressFromOutScript } from '@shared/crypto/bitcoin/bitcoin.utils';
import { logger } from '@shared/logger';
import { isEmpty, isUndefined } from '@shared/utils';

import {
  OrdApiInscriptionTxOutput,
  useOrdinalsAwareUtxoQueries,
} from '@app/query/bitcoin/ordinals/ordinals-aware-utxo.query';
import { useCurrentBtcNativeSegwitAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { buildPsbtInputsForUi } from './build-psbt-input-for-ui';
import { matchInputsOutputs } from './match-inputs-and-outputs';

export interface NonWitnessUtxo {
  version: number;
  segwitFlag: boolean;
  inputs: btc.TransactionInputRequired[];
  outputs: btc.TransactionOutputRequired[];
  witnesses: string[][];
  lockTime: number;
}

interface WitnessUtxo {
  script: Uint8Array;
  amount: bigint;
}

export interface PsbtInput {
  nonWitnessUtxo?: NonWitnessUtxo;
  witnessUtxo?: WitnessUtxo;
}

export interface PsbtInputForUi extends PsbtInput {
  address: string;
  unsignedUtxo?: OrdApiInscriptionTxOutput;
  value: number;
}

function isPlaceholderTransaction(
  address: string,
  inputs: (OrdApiInscriptionTxOutput | undefined)[],
  outputs: btc.TransactionOutputRequired[],
  network: BitcoinNetworkModes
) {
  const inputsNotFromCurrentAddress = inputs.filter(input => {
    return input?.address !== address;
  });
  const outputsNotToCurrentAddress = outputs.filter(output => {
    const addressFromScript = getAddressFromOutScript(output.script, network);
    return addressFromScript !== address;
  });
  return inputsNotFromCurrentAddress.length === 0 && outputsNotToCurrentAddress.length === 0;
}

interface UsePsbtDecodedRequestArgs {
  psbtInputs: PsbtInput[];
  unsignedInputs: btc.TransactionInputRequired[];
  unsignedOutputs: btc.TransactionOutputRequired[];
}
export function usePsbtDecodedRequest({
  psbtInputs,
  unsignedInputs,
  unsignedOutputs,
}: UsePsbtDecodedRequestArgs) {
  const [showAdvancedView, setShowAdvancedView] = useState(false);
  const network = useCurrentNetwork();
  const bitcoinAddressNativeSegwit = useCurrentBtcNativeSegwitAccountAddressIndexZero();
  const unsignedUtxos = useOrdinalsAwareUtxoQueries(unsignedInputs).map(query => query.data);

  const inputs = useMemo(() => {
    if (isUndefined(unsignedUtxos)) {
      logger.error('No UTXOs to sign');
      return [];
    }
    return buildPsbtInputsForUi({
      network: network.chain.bitcoin.network,
      psbtInputs,
      unsignedUtxos,
    });
  }, [network.chain.bitcoin.network, psbtInputs, unsignedUtxos]);

  const { fee, inputOutputPairs } = useMemo(
    () =>
      matchInputsOutputs({
        psbtInputs: inputs,
        unsignedOutputs,
      }),
    [inputs, unsignedOutputs]
  );

  const defaultToAdvancedView = useCallback(() => {
    const pairsWithNoInputs = inputOutputPairs.filter(pair => {
      return isUndefined(pair.inputs) || !pair.inputs.length;
    });
    const pairsWithNoOutputs = inputOutputPairs.filter(pair => {
      return isUndefined(pair.output) || isEmpty(pair.output);
    });
    return !!(
      inputOutputPairs.length === 0 ||
      pairsWithNoInputs.length ||
      pairsWithNoOutputs.length
    );
  }, [inputOutputPairs]);

  const showPlaceholder = useCallback(() => {
    return isPlaceholderTransaction(
      bitcoinAddressNativeSegwit,
      unsignedUtxos,
      unsignedOutputs,
      network.chain.bitcoin.network
    );
  }, [bitcoinAddressNativeSegwit, network.chain.bitcoin.network, unsignedOutputs, unsignedUtxos]);

  return {
    fee,
    inputOutputPairs,
    onSetShowAdvancedView: () => setShowAdvancedView(!showAdvancedView),
    shouldDefaultToAdvancedView: defaultToAdvancedView(),
    shouldShowPlaceholder: showPlaceholder(),
    showAdvancedView,
  };
}

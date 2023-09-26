import { useMemo } from 'react';

import * as btc from '@scure/btc-signer';
import { bytesToHex } from '@stacks/common';

import {
  BtcSignerNetwork,
  getBtcSignerLibNetworkConfigByMode,
} from '@shared/crypto/bitcoin/bitcoin.network';
import { getAddressFromOutScript } from '@shared/crypto/bitcoin/bitcoin.utils';
import { Inscription } from '@shared/models/inscription.model';
import { isDefined, isUndefined } from '@shared/utils';

import { useGetInscriptionsByOutputQueries } from '@app/query/bitcoin/ordinals/inscriptions-by-param.query';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

export interface PsbtInput {
  address: string;
  index?: number;
  inscription?: Inscription;
  isMutable: boolean;
  toSign: boolean;
  txid: string;
  value: number;
}

function getInputAddress(
  index: number,
  input: btc.TransactionInput,
  bitcoinNetwork: BtcSignerNetwork
) {
  if (isDefined(input.witnessUtxo))
    return getAddressFromOutScript(input.witnessUtxo.script, bitcoinNetwork);
  if (isDefined(input.nonWitnessUtxo))
    return getAddressFromOutScript(input.nonWitnessUtxo.outputs[index]?.script, bitcoinNetwork);
  return '';
}

function getInputValue(index: number, input: btc.TransactionInput) {
  if (isDefined(input.witnessUtxo)) return Number(input.witnessUtxo.amount);
  if (isDefined(input.nonWitnessUtxo)) return Number(input.nonWitnessUtxo.outputs[index]?.amount);
  return 0;
}

interface UseParsedInputsArgs {
  inputs: btc.TransactionInput[];
  indexesToSign?: number[];
}
export function useParsedInputs({ inputs, indexesToSign }: UseParsedInputsArgs) {
  const network = useCurrentNetwork();
  const bitcoinNetwork = getBtcSignerLibNetworkConfigByMode(network.chain.bitcoin.network);
  const bitcoinAddressNativeSegwit = useCurrentAccountNativeSegwitIndexZeroSigner().address;
  const { address: bitcoinAddressTaproot } = useCurrentAccountTaprootIndexZeroSigner();
  const inscriptions = useGetInscriptionsByOutputQueries(inputs).map(query => {
    return query.data?.results[0];
  });
  const signAll = isUndefined(indexesToSign);

  const psbtInputs = useMemo(
    () =>
      inputs.map((input, i) => {
        const inputAddress = isDefined(input.index)
          ? getInputAddress(input.index, input, bitcoinNetwork)
          : '';
        const isCurrentAddress =
          inputAddress === bitcoinAddressNativeSegwit || inputAddress === bitcoinAddressTaproot;
        // Flags when not signing ALL inputs/outputs (NONE, SINGLE, and ANYONECANPAY)
        const canChange =
          isCurrentAddress &&
          !(!input.sighashType || input.sighashType === 0 || input.sighashType === 1);
        // Should we check the sighashType here before it gets to the signing lib?
        const toSignAll = isCurrentAddress && signAll;
        const toSignIndex = isCurrentAddress && !signAll && indexesToSign.includes(i);

        return {
          address: inputAddress,
          index: input.index,
          inscription: inscriptions[i],
          isMutable: canChange,
          toSign: toSignAll || toSignIndex,
          txid: input.txid ? bytesToHex(input.txid) : '',
          value: isDefined(input.index) ? getInputValue(input.index, input) : 0,
        };
      }),
    [
      bitcoinAddressNativeSegwit,
      bitcoinAddressTaproot,
      bitcoinNetwork,
      indexesToSign,
      inputs,
      inscriptions,
      signAll,
    ]
  );

  const isPsbtMutable = useMemo(() => psbtInputs.some(input => input.isMutable), [psbtInputs]);

  return { isPsbtMutable, parsedInputs: psbtInputs };
}

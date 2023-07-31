import { useMemo } from 'react';

import * as btc from '@scure/btc-signer';
import { bytesToHex } from '@stacks/common';

import {
  BtcSignerNetwork,
  getBtcSignerLibNetworkConfigByMode,
} from '@shared/crypto/bitcoin/bitcoin.network';
import { getAddressFromOutScript } from '@shared/crypto/bitcoin/bitcoin.utils';
import { AllowedSighashTypes } from '@shared/rpc/methods/sign-psbt';
import { ensureArray, isDefined, isUndefined } from '@shared/utils';

import { useOrdinalsAwareUtxoQueries } from '@app/query/bitcoin/ordinals/ordinals-aware-utxo.query';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

export interface PsbtInput {
  address: string;
  index?: number;
  inscription?: string;
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
  allowedSighash?: AllowedSighashTypes[];
  inputs: btc.TransactionInput[];
  indexesToSign?: number[];
}
export function useParsedInputs({ allowedSighash, inputs, indexesToSign }: UseParsedInputsArgs) {
  const network = useCurrentNetwork();
  const bitcoinNetwork = getBtcSignerLibNetworkConfigByMode(network.chain.bitcoin.network);
  const bitcoinAddressNativeSegwit = useCurrentAccountNativeSegwitIndexZeroSigner().address;
  const { address: bitcoinAddressTaproot } = useCurrentAccountTaprootIndexZeroSigner();
  const utxosWithInscriptions = useOrdinalsAwareUtxoQueries(inputs).map(query => query.data);
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
        // Checks if the sighashType is allowed by the PSBT
        const isAllowedToSign =
          isUndefined(allowedSighash) ||
          ensureArray(allowedSighash).some(
            type => !input.sighashType || type === input.sighashType
          );
        // Should we check the sighashType here before it gets to the signing lib?
        const toSignAll = isCurrentAddress && signAll;
        const toSignIndex = isCurrentAddress && !signAll && indexesToSign.includes(i);

        return {
          address: inputAddress,
          index: input.index,
          inscription: utxosWithInscriptions[i]?.inscriptions,
          isMutable: canChange,
          toSign: isAllowedToSign && (toSignAll || toSignIndex),
          txid: input.txid ? bytesToHex(input.txid) : '',
          value: isDefined(input.index) ? getInputValue(input.index, input) : 0,
        };
      }),
    [
      allowedSighash,
      bitcoinAddressNativeSegwit,
      bitcoinAddressTaproot,
      bitcoinNetwork,
      indexesToSign,
      inputs,
      signAll,
      utxosWithInscriptions,
    ]
  );

  const isPsbtMutable = useMemo(() => psbtInputs.some(input => input.isMutable), [psbtInputs]);

  return { isPsbtMutable, parsedInputs: psbtInputs };
}

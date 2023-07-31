import { useCallback } from 'react';

import * as btc from '@scure/btc-signer';

import { AllowedSighashTypes } from '@shared/rpc/methods/sign-psbt';

import { subtractMoney } from '@app/common/money/calculate-money';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useParsedInputs } from './use-parsed-inputs';
import { useParsedOutputs } from './use-parsed-outputs';
import { usePsbtInscriptions } from './use-psbt-inscriptions';
import { usePsbtTotals } from './use-psbt-totals';

interface UseParsedPsbtArgs {
  allowedSighash?: AllowedSighashTypes[];
  inputs: btc.TransactionInput[];
  indexesToSign?: number[];
  outputs: btc.TransactionOutput[];
}
export function useParsedPsbt({
  allowedSighash,
  inputs,
  indexesToSign,
  outputs,
}: UseParsedPsbtArgs) {
  const network = useCurrentNetwork();
  const bitcoinAddressNativeSegwit = useCurrentAccountNativeSegwitIndexZeroSigner().address;
  const { address: bitcoinAddressTaproot } = useCurrentAccountTaprootIndexZeroSigner();
  const { isPsbtMutable, parsedInputs } = useParsedInputs({
    allowedSighash,
    inputs,
    indexesToSign,
  });
  const parsedOutputs = useParsedOutputs({ isPsbtMutable, outputs, network });

  const {
    inputsTotalNativeSegwit,
    inputsTotalTaproot,
    outputsTotalNativeSegwit,
    outputsTotalTaproot,
    psbtInputsTotal,
    psbtOutputsTotal,
  } = usePsbtTotals({
    bitcoinAddressNativeSegwit,
    bitcoinAddressTaproot,
    parsedInputs,
    parsedOutputs,
  });

  const { accountInscriptionsBeingTransferred, accountInscriptionsBeingReceived } =
    usePsbtInscriptions(parsedInputs, parsedOutputs);

  const defaultToAdvancedView = useCallback(() => {
    const noInputs = !inputs.length;
    const noOutputs = !outputs.length;
    return noInputs || noOutputs;
  }, [inputs.length, outputs.length]);

  return {
    accountInscriptionsBeingTransferred,
    accountInscriptionsBeingReceived,
    addressNativeSegwitTotal: subtractMoney(inputsTotalNativeSegwit, outputsTotalNativeSegwit),
    addressTaprootTotal: subtractMoney(inputsTotalTaproot, outputsTotalTaproot),
    fee: subtractMoney(psbtInputsTotal, psbtOutputsTotal),
    isPsbtMutable,
    psbtInputs: parsedInputs,
    psbtOutputs: parsedOutputs,
    shouldDefaultToAdvancedView: defaultToAdvancedView(),
  };
}
